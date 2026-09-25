package io.github.gitbucket.explorer.controllers

import java.io.File
import java.nio.file.Files
import java.util.Date

import gitbucket.core.controller.Context
import gitbucket.core.model.Profile.profile.blockingApi.Session
import gitbucket.core.model.{Repository, RepositoryOptions}
import gitbucket.core.service.RepositoryService.RepositoryInfo
import gitbucket.core.service.SystemSettingsService.SystemSettings
import gitbucket.core.util.Directory
import org.eclipse.jgit.api.Git
import org.mockito.Mockito._
import org.scalatra.test.scalatest.ScalatraFunSuite

/**
 * Exercises ExplorerControllerBase.explore(...) through the real HTTP routes.
 *
 * getRepository(...) is overridden per-test to hand back a hand-built RepositoryInfo
 * backed by a real on-disk git repository, bypassing the DB entirely. That's safe here
 * because the test repositories are all public: RepositoryService.isReadable(...) short
 * circuits on `!repository.isPrivate` before it ever touches the implicit Slick Session,
 * so no TransactionFilter / real database needs to be wired up for these cases.
 */
class ExplorerControllerSpec extends ScalatraFunSuite {

  private def buildContext(): Context = {
    val settings = mock(classOf[SystemSettings])
    when(settings.sshUrl).thenReturn(None)

    val context = mock(classOf[Context])
    when(context.path).thenReturn("")
    when(context.baseUrl).thenReturn("http://localhost:8080")
    when(context.loginAccount).thenReturn(None)
    when(context.settings).thenReturn(settings)
    context
  }

  private def buildRepositoryInfo(owner: String, name: String, defaultBranch: String): RepositoryInfo = {
    val model = Repository(
      userName = owner,
      repositoryName = name,
      isPrivate = false,
      description = None,
      defaultBranch = defaultBranch,
      registeredDate = new Date(),
      updatedDate = new Date(),
      lastActivityDate = new Date(),
      originUserName = None,
      originRepositoryName = None,
      parentUserName = None,
      parentRepositoryName = None,
      options = RepositoryOptions(
        issuesOption = "DISABLE",
        externalIssuesUrl = None,
        wikiOption = "DISABLE",
        externalWikiUrl = None,
        allowFork = false,
        mergeOptions = "merge-commit,squash,rebase",
        defaultMergeOption = "merge-commit",
        safeMode = false
      )
    )
    RepositoryInfo(
      owner = owner,
      name = name,
      repository = model,
      issueCount = 0,
      pullCount = 0,
      forkedCount = 0,
      milestoneCount = 0,
      branchList = Seq(defaultBranch),
      tags = Nil,
      managers = Nil
    )
  }

  /** Creates a real git repository on disk at the exact path ExplorerController will look for it. */
  private def initTestRepository(owner: String, name: String, branch: String): Unit = {
    val dir = Directory.getRepositoryDir(owner, name)
    dir.getParentFile.mkdirs()
    val git = Git.init().setDirectory(dir).setInitialBranch(branch).call()
    try {
      def addFile(path: String, content: String): Unit = {
        val file = new File(dir, path)
        file.getParentFile.mkdirs()
        Files.write(file.toPath, content.getBytes("UTF-8"))
        git.add().addFilepattern(path).call()
      }
      addFile("README.md", "hello")
      addFile("src/App.scala", "object App")
      git.commit().setMessage("initial commit").setAuthor("tester", "tester@example.com").call()
    } finally {
      git.close()
    }
  }

  initTestRepository("owner", "repo", "main")

  addFilter(
    new ExplorerController {
      override def getRepository(userName: String, repositoryName: String)(implicit s: Session): Option[RepositoryInfo] =
        if (userName == "owner" && repositoryName == "repo") Some(buildRepositoryInfo("owner", "repo", "main")) else None
      override implicit def context: Context = buildContext()
    },
    "/*"
  )

  test("explore root lists top-level files and directories") {
    get("/owner/repo/explore") {
      status should equal(200)
      body should include(""""name":"README.md"""")
      body should include(""""name":"src"""")
      body should include(""""isDirectory":true""")
    }
  }

  test("explore subpath lists nested files") {
    get("/owner/repo/explore/main/src") {
      status should equal(200)
      body should include(""""name":"App.scala"""")
      body should include(""""isDirectory":false""")
    }
  }
}
