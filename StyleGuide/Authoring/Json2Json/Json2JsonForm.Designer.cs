namespace Json2Json
{
    partial class Json2JsonForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Json2JsonForm));
            this.textBoxCASL = new System.Windows.Forms.TextBox();
            this.textBoxARM = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.ConvertButton = new System.Windows.Forms.Button();
            this.ConvertBack = new System.Windows.Forms.Button();
            this.textBoxCASLObj = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxARMObj = new System.Windows.Forms.TextBox();
            this.ToCASLObj = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.ToARMJson = new System.Windows.Forms.Button();
            this.CASLObjToARMObj = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // textBoxCASL
            // 
            this.textBoxCASL.AcceptsReturn = true;
            this.textBoxCASL.Location = new System.Drawing.Point(12, 40);
            this.textBoxCASL.Multiline = true;
            this.textBoxCASL.Name = "textBoxCASL";
            this.textBoxCASL.Size = new System.Drawing.Size(398, 267);
            this.textBoxCASL.TabIndex = 0;
            this.textBoxCASL.Text = resources.GetString("textBoxCASL.Text");
            this.textBoxCASL.TextChanged += new System.EventHandler(this.textBoxCASL_TextChanged);
            // 
            // textBoxARM
            // 
            this.textBoxARM.AcceptsReturn = true;
            this.textBoxARM.Location = new System.Drawing.Point(482, 40);
            this.textBoxARM.Multiline = true;
            this.textBoxARM.Name = "textBoxARM";
            this.textBoxARM.Size = new System.Drawing.Size(427, 267);
            this.textBoxARM.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 24);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(65, 13);
            this.label1.TabIndex = 2;
            this.label1.Text = "CASL JSON";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(479, 353);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(75, 13);
            this.label2.TabIndex = 3;
            this.label2.Text = "ARM OBJECT";
            // 
            // ConvertButton
            // 
            this.ConvertButton.Location = new System.Drawing.Point(416, 155);
            this.ConvertButton.Name = "ConvertButton";
            this.ConvertButton.Size = new System.Drawing.Size(60, 23);
            this.ConvertButton.TabIndex = 4;
            this.ConvertButton.Text = ">>>>>";
            this.ConvertButton.UseVisualStyleBackColor = true;
            this.ConvertButton.Click += new System.EventHandler(this.ConvertButton_Click);
            // 
            // ConvertBack
            // 
            this.ConvertBack.Location = new System.Drawing.Point(416, 184);
            this.ConvertBack.Name = "ConvertBack";
            this.ConvertBack.Size = new System.Drawing.Size(60, 23);
            this.ConvertBack.TabIndex = 5;
            this.ConvertBack.Text = "<<<<<<";
            this.ConvertBack.UseVisualStyleBackColor = true;
            this.ConvertBack.Click += new System.EventHandler(this.ConvertBack_Click);
            // 
            // textBoxCASLObj
            // 
            this.textBoxCASLObj.AcceptsReturn = true;
            this.textBoxCASLObj.Location = new System.Drawing.Point(12, 369);
            this.textBoxCASLObj.Multiline = true;
            this.textBoxCASLObj.Name = "textBoxCASLObj";
            this.textBoxCASLObj.Size = new System.Drawing.Size(398, 227);
            this.textBoxCASLObj.TabIndex = 6;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 353);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(78, 13);
            this.label3.TabIndex = 7;
            this.label3.Text = "CASL OBJECT";
            // 
            // textBoxARMObj
            // 
            this.textBoxARMObj.AcceptsReturn = true;
            this.textBoxARMObj.Location = new System.Drawing.Point(482, 369);
            this.textBoxARMObj.Multiline = true;
            this.textBoxARMObj.Name = "textBoxARMObj";
            this.textBoxARMObj.Size = new System.Drawing.Size(427, 227);
            this.textBoxARMObj.TabIndex = 8;
            // 
            // ToCASLObj
            // 
            this.ToCASLObj.Location = new System.Drawing.Point(148, 325);
            this.ToCASLObj.Name = "ToCASLObj";
            this.ToCASLObj.Size = new System.Drawing.Size(75, 23);
            this.ToCASLObj.TabIndex = 9;
            this.ToCASLObj.Text = "VVVVV";
            this.ToCASLObj.UseVisualStyleBackColor = true;
            this.ToCASLObj.Click += new System.EventHandler(this.ToCASLObj_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(479, 24);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(62, 13);
            this.label4.TabIndex = 10;
            this.label4.Text = "ARM JSON";
            // 
            // ToARMJson
            // 
            this.ToARMJson.Font = new System.Drawing.Font("Microsoft Sans Serif", 20F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.ToARMJson.Location = new System.Drawing.Point(653, 325);
            this.ToARMJson.Name = "ToARMJson";
            this.ToARMJson.Size = new System.Drawing.Size(75, 23);
            this.ToARMJson.TabIndex = 11;
            this.ToARMJson.Text = "^^^^^";
            this.ToARMJson.UseVisualStyleBackColor = true;
            this.ToARMJson.Click += new System.EventHandler(this.ToARMJson_Click);
            // 
            // CASLObjToARMObj
            // 
            this.CASLObjToARMObj.Location = new System.Drawing.Point(416, 460);
            this.CASLObjToARMObj.Name = "CASLObjToARMObj";
            this.CASLObjToARMObj.Size = new System.Drawing.Size(60, 23);
            this.CASLObjToARMObj.TabIndex = 12;
            this.CASLObjToARMObj.Text = ">>>>>";
            this.CASLObjToARMObj.UseVisualStyleBackColor = true;
            this.CASLObjToARMObj.Click += new System.EventHandler(this.CASLObjToARMObj_Click);
            // 
            // Json2JsonForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(921, 608);
            this.Controls.Add(this.CASLObjToARMObj);
            this.Controls.Add(this.ToARMJson);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.ToCASLObj);
            this.Controls.Add(this.textBoxARMObj);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textBoxCASLObj);
            this.Controls.Add(this.ConvertBack);
            this.Controls.Add(this.ConvertButton);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.textBoxARM);
            this.Controls.Add(this.textBoxCASL);
            this.Name = "Json2JsonForm";
            this.Text = "Json2Json";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox textBoxCASL;
        private System.Windows.Forms.TextBox textBoxARM;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button ConvertButton;
        private System.Windows.Forms.Button ConvertBack;
        private System.Windows.Forms.TextBox textBoxCASLObj;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxARMObj;
        private System.Windows.Forms.Button ToCASLObj;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button ToARMJson;
        private System.Windows.Forms.Button CASLObjToARMObj;
    }
}

