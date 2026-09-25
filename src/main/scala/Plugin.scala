import javax.servlet.ServletContext

import gitbucket.core.controller.Context
import gitbucket.core.plugin.PluginRegistry
import gitbucket.core.service.RepositoryService.RepositoryInfo
import gitbucket.core.service.SystemSettingsService.SystemSettings
import io.github.gitbucket.explorer.controllers.ExplorerController
import io.github.gitbucket.solidbase.model.Version
import play.twirl.api.Html

/**
  * Created by t_maruyama on 2017/01/31.
  */
class Plugin extends gitbucket.core.plugin.Plugin {
  override val pluginId: String = "explorer"
  override val pluginName: String = "Project explorer Plugin"
  override val description: String = "Explore Files from the file tree in the repository"
  override val versions: List[Version] = List(
    new Version("1.0.0"),
    new Version("1.0.1"),
    new Version("1.0.2"),
    new Version("1.0.3"),
    new Version("2.0.0"),
    new Version("3.0.0"),
    new Version("4.0.0"),
    new Version("5.0.0"),
    new Version("6.0.0"),
    new Version("6.1.0"),
    new Version("7.0.0"),
    new Version("8.0.0"),
    new Version("9.0.0")
  )

  override val controllers = Seq(
    "/*" -> new ExplorerController()
  )

  override val assetsMappings = Seq("/explorer" -> "explorer/assets")

  // Rendered by the repository layout, which also renders the sidebar the explorer mounts into, so the assets are
  // only added on pages that have it (no URL matching, hence no context path or reserved name handling needed).
  override def repositoryHeaders(
    registry: PluginRegistry,
    context: ServletContext,
    settings: SystemSettings
  ): Seq[(RepositoryInfo, Context) => Option[Html]] = Seq { (_, ctx) =>
    Some(Html(s"""<link rel="stylesheet" type="text/css" href="${ctx.path}/plugin-assets/explorer/plugin-explorer.css">
       |<script defer src="${ctx.path}/plugin-assets/explorer/bundle.js"></script>""".stripMargin))
  }
}
