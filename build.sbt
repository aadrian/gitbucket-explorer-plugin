organization := "io.github.gitbucket"
name := "gitbucket-explorer-plugin"
version := "9.0.0"
scalaVersion := "2.13.18"
gitbucketVersion := "4.47.1"

scalacOptions := Seq("-deprecation", "-feature", "-language:postfixOps")
javacOptions ++= Seq("-target", "8", "-source", "8")

val ScalatraVersion = "3.2.1"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest-funsuite" % "3.2.20" % "test",
  "org.scalatra" %% "scalatra-scalatest-javax" % ScalatraVersion % "test",
  "org.mockito" % "mockito-core" % "5.23.0" % "test"
)

// Forked so -Dgitbucket.home is set before gitbucket.core.util.Directory is ever touched,
// pointing repository lookups at a disposable on-disk test home instead of the real one.
Test / fork := true
Test / javaOptions += s"-Dgitbucket.home=${(Test / target).value / "gitbucket-home"}"
