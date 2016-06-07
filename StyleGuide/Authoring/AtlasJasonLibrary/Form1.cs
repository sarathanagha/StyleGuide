using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Collections.ObjectModel;
using System.Collections;

namespace AtlasJasonLibrary
{
    public class AtlasARMJson
    {
        private Object sourceObject;

        public AtlasARMJson(Object sourceObjectIn)
        {
            sourceObject = sourceObjectIn;
            string parameterName = null;
            Object parameterValue = null;

            foreach (PropertyDescriptor descriptor in TypeDescriptor.GetProperties(sourceObject))
            {
                Type type = descriptor.PropertyType;
                Object value = descriptor.GetValue(sourceObject);

                if (((descriptor.Name == "Parameters") || (descriptor.Name == "TableParameters")) && (value is ICollection))
                {
                    AddCollectionAttribute(descriptor.Name, (ICollection)descriptor.GetValue(sourceObject));
                }
                else if (descriptor.Name == "ParameterName")
                {
                    parameterName = descriptor.GetValue(sourceObject).ToString();
                }
                else if (descriptor.Name == "ParameterValue")
                {
                    parameterValue = descriptor.GetValue(sourceObject);
                }
                else
                {
                    AddAttribute(descriptor.Name, descriptor.GetValue(sourceObject));
                }
            }

            if (parameterName != null)
            {
                AddAttribute(parameterName, parameterValue);
            }
        }

        public Dictionary<String, Object> attributes = new Dictionary<String, Object>();

        public void AddAttribute(string name, object value)
        {
            attributes.Add(name, value);
        }

        public class ARMParameterObject
        {
            public Object sourceObject;
            string parameterName = null;
            Object parameterValue = null;
            public Dictionary<String, Object> attributes = new Dictionary<String, Object>();

            public ARMParameterObject(Object o)
            {
                sourceObject = o;

                foreach (PropertyDescriptor descriptor in TypeDescriptor.GetProperties(sourceObject))
                {
                    Type type = descriptor.PropertyType;
                    Object value = descriptor.GetValue(sourceObject);


                    if (((descriptor.Name == "Parameters") || (descriptor.Name == "TableParameters")) && (value is ICollection))
                    {
                        AddCollectionAttribute(descriptor.Name, (ICollection)descriptor.GetValue(sourceObject));
                    }
                    else if (descriptor.Name == "ParameterName")
                    {
                        parameterName = descriptor.GetValue(sourceObject).ToString();
                    }
                    else if (descriptor.Name == "ParameterValue")
                    {
                        parameterValue = descriptor.GetValue(sourceObject);
                    }
                    else
                    {
                        attributes.Add(descriptor.Name, descriptor.GetValue(sourceObject));
                    }
                }

            }

            public string GetObjectName()
            {
                return parameterName;
            }

            public Object GetObjectValue()
            {
                if (attributes.Count != 0 && parameterValue == null) 
                    return attributes;

                return parameterValue;
            }

            public void AddCollectionAttribute(string name, ICollection parameterObjectCollection)
            {
                Dictionary<String, Object> collectionOfParameters = new Dictionary<String, Object>();

                foreach (Object parameterObject in parameterObjectCollection)
                {
                    ARMParameterObject armParameterObject = new ARMParameterObject(parameterObject);
                    collectionOfParameters.Add(armParameterObject.GetObjectName(), armParameterObject.GetObjectValue());
                }

                attributes.Add(name, collectionOfParameters);
            }

        }

        public void AddCollectionAttribute(string name, ICollection parameterObjectCollection)
        {
            Dictionary<String, Object> collectionOfParameters = new Dictionary<String, Object>();

            foreach (Object parameterObject in parameterObjectCollection)
            {
                ARMParameterObject armParameterObject = new ARMParameterObject(parameterObject);
                collectionOfParameters.Add(armParameterObject.GetObjectName(), armParameterObject.GetObjectValue());
            }

            attributes.Add(name, collectionOfParameters);
        }

        public string GetARMJson()
        {   
            return JsonConvert.SerializeObject(attributes, Formatting.Indented);
        }
    }

    public class CASLProperties
    {
        public string ParameterName;
        public string ParameterValue;
        public string FriendlyName;
        public Collection<CASLProperties> Parameters { get; set; }
        public Dictionary<String, Object> attributes = new Dictionary<String, Object>();

        public Object GetValue()
        {
            if (Parameters != null)
            {
                foreach (CASLProperties p in Parameters)
                {
                    attributes.Add(p.ParameterName, p.GetValue());
                }
            }

            return attributes;
        }
    }
    public class CASLObject
    {
        public string Id { get; set; }
        public String Name { get; set; }

        public Collection<CASLProperties> Parameters { get; set; }

        public DataSet properties = new DataSet("AtlasARMJason");

        public void TransposeProperties()
        {
            properties.Namespace = "AtlasJsonEngine";
            
            // Parameter collectuion
            DataTable table = new DataTable("Properties");
            DataRow newRow = table.NewRow();
            table.Rows.Add(newRow);

            foreach (CASLProperties p in Parameters)
            {
                DataColumn dataColumn = new DataColumn(p.ParameterName, typeof(string));
                table.Columns.Add(dataColumn);
                newRow[p.ParameterName] = p.ParameterValue;
            }
            properties.Tables.Add(table);
            properties.AcceptChanges();
        }

        public string ToARMJson2()
        {
            AtlasARMJson atlasARMJson = new AtlasARMJson(this);
            return atlasARMJson.GetARMJson();
        }

        public string ToARMJson()
        {
            DataSet dataSet = new DataSet("AtlasARMJason");
            dataSet.Namespace = "AtlasJsonEngine";

            // Parameter collectuion
            DataTable table = new DataTable("Properties");
            DataRow newRow = table.NewRow();
            table.Rows.Add(newRow);
            
            foreach (CASLProperties p in Parameters)
            {
                DataColumn dataColumn = new DataColumn(p.ParameterName, typeof(string));
                table.Columns.Add(dataColumn);
                newRow[p.ParameterName] = p.ParameterValue;
            }
            dataSet.Tables.Add(table);
            dataSet.AcceptChanges();
            string json = JsonConvert.SerializeObject(dataSet, Formatting.Indented);
            return json;
        }
    }



    public class CASLPropertiesConverter : JsonConverter
    {
        public CASLPropertiesConverter()
        {
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            DataSet dataSet = new DataSet("AtlasARMJason");
            dataSet.Namespace = "AtlasJsonEngine";
            DataTable table = new DataTable("Properties");
            DataRow newRow = table.NewRow();
            table.Rows.Add(newRow);

            foreach (CASLProperties p in (Collection<CASLProperties>)value)
            {
                DataColumn dataColumn = new DataColumn(p.ParameterName, typeof(string));
                table.Columns.Add(dataColumn);
                newRow[p.ParameterName] = p.ParameterValue;
            }
            dataSet.Tables.Add(table);
            dataSet.AcceptChanges();
            string json = JsonConvert.SerializeObject(table, Formatting.Indented);
            JObject objectProperties = JObject.FromObject(dataSet);
            objectProperties.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException("Unnecessary because CanRead is false. The type will skip the converter.");
        }

        public override bool CanRead
        {
            get { return false; }
        }

        public override bool CanConvert(Type objectType)
        {
            return false;// (objectType == typeof(Collection<CASLProperties>));
        }
    }


    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            this.textBox1.Text = "{\"Id\": \"HiveActivity\", \"Name\": \"Hive Activity\",\"Parameters\": [{\"ParameterName\": \"Name\",\"ParameterValue\" : \"SomeValue1\",\"FriendlyName\": \"Activity Name\"            },            {                \"ParameterName\": \"Description\",                \"ParameterValue\" : \"SomeValue2\",                \"FriendlyName\": \"Activity Description\"            }        ]}";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Object caslObject = JsonConvert.DeserializeObject(this.textBox1.Text);
            AtlasARMJson atlasARMJson = new AtlasARMJson(caslObject);
            this.textBox2.Text = atlasARMJson.GetARMJson();
            //this.textBox2.Text = JsonConvert.SerializeObject(caslObject, Formatting.Indented, new CASLPropertiesConverter());
            //this.textBox2.Text = caslObject.ToARMJson2();
           // LogReaderOutput(this.textBox1.Text);
        }




        string ObjectToJson<T>(T t)
        {
            string json = JsonConvert.SerializeObject(t, Formatting.Indented);
            return json;
        }


        void SerializeToFile<T>(string fileFullPath, T t)
        {
            File.WriteAllText(fileFullPath, JsonConvert.SerializeObject(t));
        }

        void SerializeViaStreamWriter<T>(string fileFullPath, T t)
        {
            using (StreamWriter file = File.CreateText(fileFullPath))
            {
                JsonSerializer serializer = new JsonSerializer();
                serializer.Serialize(file, t);
            }
        }

        T DesirializeFromFile<T>(string fileFullPath)
        {
            T t = JsonConvert.DeserializeObject<T>(File.ReadAllText(fileFullPath));
            return t;
        }

        T DesirializeViaStreamReader<T>(string fileFullPath)
        {
            using (StreamReader file = File.OpenText(fileFullPath))
            {
                JsonSerializer serializer = new JsonSerializer();
                T t = (T)serializer.Deserialize(file, typeof(T));
                return t;
            }
        }

        void LogReaderOutput(string json)
        {
            JsonTextReader reader = new JsonTextReader(new StringReader(json));
            while (reader.Read())
            {
                if (reader.Value != null)
                {
                    Console.WriteLine("Token: {0}, Value: {1}", reader.TokenType, reader.Value);
                }
                else
                {
                    Console.WriteLine("Token: {0}", reader.TokenType);
                }
            }
        }
    }
}
