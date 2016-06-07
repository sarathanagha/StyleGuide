using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Validators;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{
    public class AzureSQLController : SolutionControllerBase
    {
        public AzureSQLController(ILogger logger)
            : base(logger)
        {
        }

        [HttpPost]
        [Route("api/{subscriptionId}/import")]
        public async Task<IHttpActionResult> Post([FromUri] string subscriptionId, [FromBody] ImportParameters parameters)
        {
            ThrowIf.NullOrEmpty(parameters.ServerName, "ServerName");
            ThrowIf.NullOrEmpty(parameters.DatabaseName, "DatabaseName");
            ThrowIf.NullOrEmpty(parameters.UserName, "UserName");
            ThrowIf.NullOrEmpty(parameters.Password, "Password");
            ThrowIf.NullOrEmpty(parameters.ScriptLink, "ScriptLink");

            try
            {
                HttpWebRequest dbScriptRequest = (HttpWebRequest)WebRequest.Create(parameters.ScriptLink);
                var respStr = (await dbScriptRequest.GetResponseAsync()).GetResponseStream();
                var rdr = new StreamReader(respStr);
                var sqlScript = await rdr.ReadToEndAsync();
                var scripts = sqlScript.Split(new string[] { "GO", "go", "Go", "gO" }, StringSplitOptions.RemoveEmptyEntries);

                if (scripts.Length == 0)
                {
                    throw new Exception(string.Format("The sql script file with name: {0} is empty", parameters.ScriptLink));
                }

                var connectionBuilder = CreateConnectionStringBuilder(parameters.ServerName, parameters.DatabaseName, parameters.UserName, parameters.Password);

                using (var connection = new SqlConnection(connectionBuilder.ConnectionString))
                {
                    await connection.OpenAsync();
                    foreach (var script in scripts)
                    {
                        using (var command = new SqlCommand(script, connection))
                        {
                            await command.ExecuteNonQueryAsync();
                        }
                    }
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "SqlError: {0}", ex.ToString());
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        private static SqlConnectionStringBuilder CreateConnectionStringBuilder(string server, string database, string username, string password)
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = server + CloudConfigurationManager.GetSetting("Microsoft.SqlServer.Import.Suffix");
            builder.InitialCatalog = database;
            builder.UserID = username;
            builder.Password = password;
            builder.TrustServerCertificate = false; //TODO: [parvezp] Do we need to make this true in future?
            builder.Encrypt = true;
            return builder;
        }
    }
}