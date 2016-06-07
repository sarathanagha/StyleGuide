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
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            this.textBox1.Text = "{\"Id\": \"HiveActivity\", \"Name\": \"Hive Activity\",\"Parameters\": [{\"ParameterName\": \"Name\",\"ParameterValue\" : \"SomeValue1\",\"FriendlyName\": \"Activity Name\"            },            {                \"ParameterName\": \"Description\",                \"ParameterValue\" : \"SomeValue2\",                \"FriendlyName\": \"Activity Description\"            }        ]}";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            AtlasARMJson atlasARMJson = new AtlasARMJson(JsonConvert.DeserializeObject(this.textBox1.Text));
            this.textBox2.Text = atlasARMJson.GetARMJson();
        }
    }

    public class AtlasARMJsonBase
    {
        protected Object sourceObject;
        public AtlasARMJsonBase(Object o) { sourceObject = o; }
        public string parameterName = null;
        public Object parameterValue = null;

        public Dictionary<String, Object> attributes = new Dictionary<String, Object>();

        public void TransposeProperties()
        {
            // Normalize the properties
            foreach (PropertyDescriptor descriptor in TypeDescriptor.GetProperties(sourceObject))
            {
                Object value = descriptor.GetValue(sourceObject);
                AddAttribute(descriptor.Name, descriptor.GetValue(sourceObject));
            }
        }

        private void AddCollectionAttribute(string name, ICollection parameterObjectCollection)
        {
            Dictionary<String, Object> collectionOfParameters = new Dictionary<String, Object>();
            ArrayList tableParameters = new ArrayList();

            foreach (Object parameterObject in parameterObjectCollection)
            {
                ARMParameterObject armParameterObject = new ARMParameterObject(parameterObject);
                if (armParameterObject.GetObjectName() != null)
                {
                    attributes.Add(armParameterObject.GetObjectName(), armParameterObject.GetObjectValue());
                    //collectionOfParameters.Add(armParameterObject.GetObjectName(), armParameterObject.GetObjectValue());
                }
                else
                {
                    tableParameters.Add(armParameterObject.GetObjectValue());
                }
            }

            //attributes.Add(name, collectionOfParameters);

            if (tableParameters.Count > 0)
            {
                attributes.Add(name, tableParameters);
            }
        }

        public void AddAttribute(string name, object value)
        {
            if ((name == "Parameters")  && (value is ICollection))
            {
                AddCollectionAttribute(name, (ICollection)value);
            }
            else if ( (name == "TableParameters") && (value is ICollection))
            {
                AddCollectionAttribute(name, (ICollection)value);
            }
            else if (name == "ParameterName")
            {
                parameterName = value.ToString();
            }
            else if (name == "ParameterValue")
            {
                parameterValue = value;
            }
            else
            {
                //AddStaticAttribute(name, value);
            }
        }

        public virtual void AddStaticAttribute(string name, object value)
        {
            // Base class does not know about the static attributes of different objects
            // Derived types implement this method to process their static attributes
        }
    }

    public class ARMParameterObject : AtlasARMJsonBase
    {

        public ARMParameterObject(Object o)
            : base(o)
        {
            TransposeProperties();
        }

        public string GetObjectName()
        {
            return parameterName;
        }

        public Object GetObjectValue()
        {
            if (attributes.Count != 0)
                return attributes;

            return parameterValue == null ? "" : parameterValue;
        }
    }

 
    public class AtlasARMJson : AtlasARMJsonBase
    {

        public AtlasARMJson(Object o)
            : base(o)
        {
            TransposeProperties();
        }

        public override void AddStaticAttribute(string name, object value)
        {
            attributes.Add(name, value);
        }

        public string GetARMJson()
        {   
            return JsonConvert.SerializeObject(attributes, Formatting.Indented);
        }
    }
}
