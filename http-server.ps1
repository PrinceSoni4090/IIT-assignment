
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
 
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "$basedir/node$exe"  "$basedir/node_modules/http-server/bin/http-server" $args
  } else {
    & "$basedir/node$exe"  "$basedir/node_modules/http-server/bin/http-server" $args
  }
  $ret=$LASTEXITCODE
} else {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "node$exe"  "$basedir/node_modules/http-server/bin/http-server" $args
  } else {
    & "node$exe"  "$basedir/node_modules/http-server/bin/http-server" $args
  }
  $ret=$LASTEXITCODE
}
exit $ret
