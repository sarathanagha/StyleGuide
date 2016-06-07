using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

// Json helpers
using System.Runtime.Serialization;
using System.Web;
using System.Runtime.Serialization.Json;
using System.IO;

namespace Json2Json
{
    public partial class Json2JsonForm : Form
    {
        public Json2JsonForm()
        {
            InitializeComponent();
        }

        private void ConvertButton_Click(object sender, EventArgs e)
        {
            ToCASLObj_Click(null, null);
            CASLObjToARMObj_Click(null, null);
            ToARMJson_Click(null, null);
        }

        private void ConvertBack_Click(object sender, EventArgs e)
        {

        }

        private void ToCASLObj_Click(object sender, EventArgs e)
        {
            string jsonString = this.textBoxCASL.Text;

            caslActivity = JsonHelper.JsonDeserialize<CASLActivity>(jsonString);
            this.textBoxCASLObj.Text = caslActivity.ToString() + Environment.NewLine + "{" + Environment.NewLine;

            foreach (PropertyDescriptor descriptor in TypeDescriptor.GetProperties(caslActivity))
            {
                string name = descriptor.Name;
                Type type = descriptor.PropertyType;
                object value = descriptor.GetValue(caslActivity);
                this.textBoxCASLObj.Text += "   " + type.ToString() + " " + name + "=" + value + ";" + Environment.NewLine;
            }
            this.textBoxCASLObj.Text += "}";
        }

        private void ToARMJson_Click(object sender, EventArgs e)
        {
            string jsonString = JsonHelper.JsonSerializer<ARMActivity>(armActivity);
            this.textBoxARM.Text = jsonString;
        }

        private void CASLObjToARMObj_Click(object sender, EventArgs e)
        {
            armActivity.Description = "ARM Deployable Activity";
            armActivity.ActivityName = caslActivity.Name;
            armActivity.ActivityId = caslActivity.Id;

            this.textBoxARMObj.Text = armActivity.ToString() + Environment.NewLine + "{" + Environment.NewLine;

            foreach (PropertyDescriptor descriptor in TypeDescriptor.GetProperties(armActivity))
            {
                string name = descriptor.Name;
                Type type = descriptor.PropertyType;
                object value = descriptor.GetValue(armActivity);
                this.textBoxARMObj.Text += "   " + type.ToString() + " " + name + "=" + value + ";" + Environment.NewLine;
            }
            this.textBoxARMObj.Text += "}";

        }

        private CASLActivity caslActivity;
        private ARMActivity armActivity = new ARMActivity();

        private void textBoxCASL_TextChanged(object sender, EventArgs e)
        {

        }
    }

    /// <summary>
    /// JSON Serialization and Deserialization Assistant Class
    /// </summary>
    public class JsonHelper
    {
        /// <summary>
        /// JSON Serialization
        /// </summary>
        public static string JsonSerializer<T>(T t)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            MemoryStream ms = new MemoryStream();
            ser.WriteObject(ms, t);
            string jsonString = Encoding.UTF8.GetString(ms.ToArray());
            ms.Close();
            return jsonString;
        }
        /// <summary>
        /// JSON Deserialization
        /// </summary>
        public static T JsonDeserialize<T>(string jsonString)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            T obj = (T)ser.ReadObject(ms);
            return obj;
        }
    }

    public class CASLActivity
    {
        public string Name { get; set; }
        public int Id { get; set; }

        public string Description { get; set; }
        public int FamilyId { get; set; }
        public string Category { get; set; }
        public string Items { get; set; }
        public string Parameters { get; set; }
    }

    public class ARMActivity
    {
        public string Description { get; set; }
        public string ActivityName { get; set; }
        public int ActivityId { get; set; }

        public int FamilyId { get; set; }
        public string Category { get; set; }
        public string Items { get; set; }
        public string Parameters { get; set; }
    }

}
