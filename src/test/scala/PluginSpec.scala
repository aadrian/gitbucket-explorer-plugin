import gitbucket.core.service.SystemSettingsService.SystemSettings
import javax.servlet.ServletContext
import org.mockito.Mockito._
import org.scalatest.funsuite.AnyFunSuite

/**
 * GitBucket matches the pattern with String.matches against the request URI, which includes the context path.
 */
class PluginSpec extends AnyFunSuite {

  private def javaScripts(contextPath: String, baseUrl: Option[String] = None): (String, String) = {
    val servletContext = mock(classOf[ServletContext])
    when(servletContext.getContextPath).thenReturn(contextPath)
    val settings = mock(classOf[SystemSettings])
    when(settings.baseUrl).thenReturn(baseUrl)
    new Plugin().javaScripts(null, servletContext, settings).head
  }

  private val injected = Seq(
    "/root/repo",
    "/root/repo/tree/master/src",
    "/root/repo/issues",
    "/root/signin",
    "/root/admin/tree/master",
    "/group/dashboard",
    "/root/groups"
  )

  private val notInjected = Seq(
    "/signin",
    "/signin/oidc",
    "/dashboard",
    "/dashboard/issues",
    "/admin",
    "/admin/users",
    "/groups/new",
    "/root",
    "/"
  )

  Seq("", "/gitbucket", "/git.bucket+x").foreach { contextPath =>
    test(s"injects on repository pages only (context path '$contextPath')") {
      val (pattern, _) = javaScripts(contextPath)
      injected.foreach(uri => assert((contextPath + uri).matches(pattern), s"expected match: $contextPath$uri"))
      notInjected.foreach(uri => assert(!(contextPath + uri).matches(pattern), s"expected no match: $contextPath$uri"))
    }
  }

  test("uses the servlet context path, not baseUrl, for matching") {
    val (pattern, _) = javaScripts("/gitbucket", Some("https://example.com/gitbucket"))
    assert("/gitbucket/root/repo".matches(pattern))
    assert(!"/gitbucket/signin".matches(pattern))
  }

  test("asset URLs use baseUrl when set, otherwise the context path") {
    val (_, withBaseUrl) = javaScripts("/gitbucket", Some("https://example.com/gitbucket"))
    assert(withBaseUrl.contains("https://example.com/gitbucket/plugin-assets/explorer/bundle.js"))
    assert(withBaseUrl.contains("https://example.com/gitbucket/plugin-assets/explorer/plugin-explorer.css"))

    val (_, withContextPath) = javaScripts("/gitbucket")
    assert(withContextPath.contains("/gitbucket/plugin-assets/explorer/bundle.js"))
  }
}
