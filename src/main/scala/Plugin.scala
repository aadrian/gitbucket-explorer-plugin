import javax.servlet.ServletContext

import gitbucket.core.plugin.PluginRegistry
import gitbucket.core.service.SystemSettingsService.SystemSettings
import io.github.gitbucket.explorer.controllers.ExplorerController
import io.github.gitbucket.solidbase.model.Version

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

  override def javaScripts(registry: PluginRegistry, context: ServletContext, settings: SystemSettings): Seq[(String, String)] = {
    val path = settings.baseUrl.getOrElse(context.getContextPath)
    Seq(
      "(?!/(?:signin|dashboard|admin)(?:/|$)).+/.+" -> s"""
       |</script>
       |<script>
       |  var link = document.createElement('link');
       |  link.setAttribute('rel', 'stylesheet');
       |  link.setAttribute('type', 'text/css');
       |  link.setAttribute('href', '$path/plugin-assets/explorer/plugin-explorer.css');
       |  document.getElementsByTagName('head')[0].appendChild(link);
       |</script>
       |<script src="$path/plugin-assets/explorer/bundle.js"></script>
       |<script>
       """.stripMargin
    )
  }
}
