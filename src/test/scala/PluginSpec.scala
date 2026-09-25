import gitbucket.core.controller.Context
import gitbucket.core.service.SystemSettingsService.SystemSettings
import javax.servlet.ServletContext
import org.mockito.Mockito._
import org.scalatest.funsuite.AnyFunSuite

class PluginSpec extends AnyFunSuite {

  private val plugin = new Plugin()

  private def header(contextPath: String): String = {
    val headers = plugin.repositoryHeaders(null, mock(classOf[ServletContext]), mock(classOf[SystemSettings]))
    assert(headers.size == 1)
    val context = mock(classOf[Context])
    when(context.path).thenReturn(contextPath)
    headers.head(null, context).getOrElse(fail("expected the explorer assets")).body
  }

  Seq("", "/gitbucket", "https://example.com/gitbucket").foreach { contextPath =>
    test(s"adds the stylesheet and the deferred script below '$contextPath'") {
      val html = header(contextPath)
      assert(html.contains(s"""<link rel="stylesheet" type="text/css" href="$contextPath/plugin-assets/explorer/plugin-explorer.css">"""))
      assert(html.contains(s"""<script defer src="$contextPath/plugin-assets/explorer/bundle.js"></script>"""))
    }
  }

  test("no longer injects through javaScripts") {
    assert(plugin.javaScripts(null, mock(classOf[ServletContext]), mock(classOf[SystemSettings])).isEmpty)
  }
}
