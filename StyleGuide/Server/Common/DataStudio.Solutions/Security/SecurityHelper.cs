using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Validators;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Microsoft.DataStudio.Services.Security
{
    public class SecurityHelper
    {
        //TODO : rajdey This will be pulled from secret store
        static string _key = "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";
        string sharedSecret = "AGWBEa4Xv8kan9MID8xwAYI1ZW26k87ZQ5F";
        private const string SQl_PASSWORD = "sqlServerPassword";
        private const string VALUEPROPERTY = "value";

        private byte[] _salt = Encoding.ASCII.GetBytes(_key);
        private const int KeySizeDivisor = 8;
        ILogger logger = LoggerFactory.CreateServiceLogger(new LoggerSettings
        {
            ComponentId = ComponentID.DataStudioService,
            EnableMdsTracing = true,
            SourceLevels = SourceLevels.All
        });

        /// <summary>
        /// Encrypt the given string using AES.  The string can be decrypted using 
        /// Encrypt().  The sharedSecret parameters must match.
        /// </summary>
        /// <param name="plainText">The text to encrypt.</param>
        public async Task<string> EncryptPassword(string plainText)
        {
            if(string.IsNullOrEmpty(plainText))
            {
                return null;
            }

            //Deserialize the parameter text to a Json object to find the password field
            JavaScriptSerializer json_serializer = new JavaScriptSerializer();
            Dictionary<string, Object> parameterList = (Dictionary<string, Object>)json_serializer.DeserializeObject(plainText);
            // If ParameterList does not contain a SQL Server Password, No need to encrypt - return the plainText
            if (!parameterList.Keys.Contains<string>(SQl_PASSWORD)) return plainText;
            var passwordNode = parameterList[SQl_PASSWORD] as Dictionary<string, object>;
            // if password field not found throw error
            ThrowIf.Null(passwordNode, SQl_PASSWORD);

            // Return the encrypted bytes from the memory stream.
            var dictionaryObject = new Dictionary<string, Object>();
            dictionaryObject.Add(VALUEPROPERTY, await Encrypt(passwordNode.Values.First().ToString()));
            parameterList[SQl_PASSWORD] = dictionaryObject;
            return json_serializer.Serialize(parameterList);
        }

        public async Task<string> Encrypt(string value)
        {
            string outStr = null;                       // Encrypted string to return
            RijndaelManaged aesAlg = null;              // RijndaelManaged object used to encrypt the data.

            try
            {
                // generate the key from the shared secret and the salt
                Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(sharedSecret, _salt);

                // Create a RijndaelManaged object
                aesAlg = new RijndaelManaged();
                aesAlg.Key = key.GetBytes(aesAlg.KeySize / KeySizeDivisor);

                // Create a encryptor to perform the stream transform.
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (var msEncrypt = new MemoryStream())
                {
                    // prepend the IV
                    await msEncrypt.WriteAsync(BitConverter.GetBytes(aesAlg.IV.Length), 0, sizeof(int));
                    await msEncrypt.WriteAsync(aesAlg.IV, 0, aesAlg.IV.Length);
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            await swEncrypt.WriteAsync(value);
                        }
                    }
                    outStr = Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format("SECURITY EXCEPTION- {0}", ex.Message));
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                    aesAlg.Clear();
            }

            return outStr;
        }

        /// <summary>
        /// Decrypt the given string.  Assumes the string was encrypted using 
        /// Decrypt(), using an identical sharedSecret.
        /// </summary>
        /// <param name="cipherText">The text to decrypt.</param>
        public async Task<string> DecryptPassword(string cipherText)
        {
            if(string.IsNullOrEmpty(cipherText))
            {
                return null;
            }

            //Deserialize the parameter text to a Json object to find the password field
            JavaScriptSerializer json_serializer = new JavaScriptSerializer();
            Dictionary<string, Object> parameterList = (Dictionary<string, Object>)json_serializer.DeserializeObject(cipherText);
            // If ParameterList does not contain a SQL Server Password, No need to decrypt - return the cipherText
            if (!parameterList.ContainsKey(SQl_PASSWORD)) return cipherText;
            var passwordNode = parameterList[SQl_PASSWORD] as Dictionary<string, object>;
            // if password field not found throw error
            ThrowIf.Null(passwordNode, SQl_PASSWORD);

            var dictionaryObject = new Dictionary<string, Object>();
            dictionaryObject.Add(VALUEPROPERTY, await Decrypt(passwordNode.Values.First().ToString()));
            parameterList[SQl_PASSWORD] = dictionaryObject;
            return json_serializer.Serialize(parameterList);
        }

        public async Task<string> Decrypt(string value)
        {
            // Declare the RijndaelManaged object
            // used to decrypt the data.
            RijndaelManaged aesAlg = null;

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            try
            {
                // generate the key from the shared secret and the salt
                Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(sharedSecret, _salt);

                // Create the streams used for decryption.
                byte[] bytes = Convert.FromBase64String(value);
                using (var msDecrypt = new MemoryStream(bytes))
                {
                    // Create a RijndaelManaged object
                    // with the specified key and IV.
                    aesAlg = new RijndaelManaged();
                    aesAlg.Key = key.GetBytes(aesAlg.KeySize / KeySizeDivisor);
                    // Get the initialization vector from the encrypted stream
                    aesAlg.IV = ReadByteArray(msDecrypt);
                    // Create a decrytor to perform the stream transform.
                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = await srDecrypt.ReadToEndAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format("SECURITY EXCEPTION- {0}", ex.Message));
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                    aesAlg.Clear();
            }

            return plaintext;
        }

        private byte[] ReadByteArray(Stream s)
        {
            byte[] rawLength = new byte[sizeof(int)];
            if (s.Read(rawLength, 0, rawLength.Length) != rawLength.Length)
            {
                throw new SystemException("Stream did not contain properly formatted byte array");
            }

            byte[] buffer = new byte[BitConverter.ToInt32(rawLength, 0)];
            if (s.Read(buffer, 0, buffer.Length) != buffer.Length)
            {
                throw new SystemException("Did not read byte array properly");
            }

            return buffer;
        }
    }

}