<# Configures your local Web.config file, hosts file, and restarts your IIS site to pick up the Web.config changes.
#  Usage: .\setEnvironment.ps1 <environment name>
#  Examples: .\setEnvironment.ps1 atlas-preview
#            .\setEnvironment.ps1 adf-preview
#>

$hostPath = "$Env:windir\System32\drivers\etc\hosts"

$adfPreview = new-object psobject -Property @{
    Name="adf-preview";
    Url="adf-preview.cloudapp.net";
}
$atlasPreview = new-object psobject -Property @{
    Name="atlas-preview";
    Url="atlas-preview.cloudapp.net";
}
$envArray = $adfPreview,$atlasPreview

# hosts file helper functions

function shouldRemove($hostLine)
{
    for($i=0; $i -lt $envArray.length; $i++)
    {
        if($hostLine.contains($envArray[$i].Url))
        {
            return $true
        }
    }
    return $false
}

function getFilteredHostContent($hostPath)
{

    $hostContent = get-content -path $hostPath
    $newHostContent=$()

    if($hostContent -eq $null) {
       return "";
    }

    if($hostContent[0].Length.Equals(1)) {
        # only one row in the host file.
        if(-not $(shouldRemove($hostContent)))
        {
            $newHostContent += $hostContent
            $newHostContent += "`r`n"
        }
    } else {
        # multiple rows in the host file.
        for($j=0;$j -lt $hostContent.length;$j++)
        {
            if(-not $(shouldRemove($hostContent[$j])))
            {
                $newHostContent += $hostContent[$j]
                $newHostContent += "`r`n"
            }
        }
    }

    $newHostContent = $newHostContent -replace "[`r`n]+$",""
    return $newHostContent
}

If (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Warning "You are not running this script with Administrator permissions. Please re-run the script as an Administrator."
    Break
}

if($args[0] -eq "revert") {
    tf undo $webConfigPath /noprompt
    "Clearing hosts file of known Atlas environments."
    $hostContent = getFilteredHostContent($hostPath);
    $hostContent | Set-Content $hostPath
    Break
}

$environmentName = $args[0];

for($i=0;$i -lt $envArray.length;$i++)
{
    if ($envArray[$i].Name -eq $environmentName)
    {
        $environment = $envArray[$i];
        echo "Selected environment: $environmentName";
    }
}
if (-not $environment)
{
    throw "Unknown environment: " + $environmentName
}

"Restarting IIS services..."
iisreset /noforce

# update the host file
""
"Updating the hosts file..."
$hostContent = getFilteredHostContent($hostPath);
$hostContent += "`r`n"
$hostContent += "127.0.0.1" + "`t" + $environment.Url + "`t" + "# entry written by automated script, ~\Product\Source\DataStudioPOC\Modules\DataFactory\tools\setEnvironment.ps1"
$hostContent | Set-Content $hostPath
