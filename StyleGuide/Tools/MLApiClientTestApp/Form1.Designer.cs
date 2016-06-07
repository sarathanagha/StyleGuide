using System.Windows.Forms;

namespace MLApiClientTestApp
{
    partial class Form1
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
            this.getTokenButton = new System.Windows.Forms.Button();
            this.listWorkspacesButton = new System.Windows.Forms.Button();
            this.tokenBox = new System.Windows.Forms.TextBox();
            this.outputTextBox = new System.Windows.Forms.TextBox();
            this.createWorkspaceButton = new System.Windows.Forms.Button();
            this.clearButton = new System.Windows.Forms.Button();
            this.inputTextBox = new System.Windows.Forms.TextBox();
            this.setTokenButton = new System.Windows.Forms.Button();
            this.listExperimentsButton = new System.Windows.Forms.Button();
            this.deployButton = new System.Windows.Forms.Button();
            this.masterPackButton = new System.Windows.Forms.Button();
            this.masterWorkspaceIdBox = new System.Windows.Forms.TextBox();
            this.masterExperimentIdBox = new System.Windows.Forms.TextBox();
            this.createProjectButton = new System.Windows.Forms.Button();
            this.deleteWorkspaceButton = new System.Windows.Forms.Button();
            this.deleteWorkspacesButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // getTokenButton
            // 
            this.getTokenButton.Location = new System.Drawing.Point(13, 13);
            this.getTokenButton.Name = "getTokenButton";
            this.getTokenButton.Size = new System.Drawing.Size(75, 23);
            this.getTokenButton.TabIndex = 0;
            this.getTokenButton.Text = "Get Token";
            this.getTokenButton.UseVisualStyleBackColor = true;
            this.getTokenButton.Click += new System.EventHandler(this.getTokenButton_Click);
            // 
            // listWorkspacesButton
            // 
            this.listWorkspacesButton.Location = new System.Drawing.Point(189, 185);
            this.listWorkspacesButton.Name = "listWorkspacesButton";
            this.listWorkspacesButton.Size = new System.Drawing.Size(132, 23);
            this.listWorkspacesButton.TabIndex = 2;
            this.listWorkspacesButton.Text = "List Workspace(s)";
            this.listWorkspacesButton.UseVisualStyleBackColor = true;
            this.listWorkspacesButton.Click += new System.EventHandler(this.listWorkspacesButton_Click);
            // 
            // tokenBox
            // 
            this.tokenBox.Location = new System.Drawing.Point(94, 12);
            this.tokenBox.Multiline = true;
            this.tokenBox.Name = "tokenBox";
            this.tokenBox.Size = new System.Drawing.Size(745, 77);
            this.tokenBox.TabIndex = 3;
            // 
            // outputTextBox
            // 
            this.outputTextBox.Location = new System.Drawing.Point(13, 313);
            this.outputTextBox.Multiline = true;
            this.outputTextBox.Name = "outputTextBox";
            this.outputTextBox.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.outputTextBox.Size = new System.Drawing.Size(922, 346);
            this.outputTextBox.TabIndex = 4;
            // 
            // createWorkspaceButton
            // 
            this.createWorkspaceButton.Location = new System.Drawing.Point(478, 185);
            this.createWorkspaceButton.Name = "createWorkspaceButton";
            this.createWorkspaceButton.Size = new System.Drawing.Size(132, 23);
            this.createWorkspaceButton.TabIndex = 6;
            this.createWorkspaceButton.Text = "CreateWorkspace";
            this.createWorkspaceButton.UseVisualStyleBackColor = true;
            this.createWorkspaceButton.Click += new System.EventHandler(this.createWorkspaceButton_Click);
            // 
            // clearButton
            // 
            this.clearButton.Location = new System.Drawing.Point(860, 284);
            this.clearButton.Name = "clearButton";
            this.clearButton.Size = new System.Drawing.Size(75, 23);
            this.clearButton.TabIndex = 7;
            this.clearButton.Text = "Clear";
            this.clearButton.UseVisualStyleBackColor = true;
            this.clearButton.Click += new System.EventHandler(this.clearButton_Click);
            // 
            // inputTextBox
            // 
            this.inputTextBox.Location = new System.Drawing.Point(12, 185);
            this.inputTextBox.Name = "inputTextBox";
            this.inputTextBox.Size = new System.Drawing.Size(153, 20);
            this.inputTextBox.TabIndex = 8;
            // 
            // setTokenButton
            // 
            this.setTokenButton.Location = new System.Drawing.Point(707, 95);
            this.setTokenButton.Name = "setTokenButton";
            this.setTokenButton.Size = new System.Drawing.Size(132, 23);
            this.setTokenButton.TabIndex = 9;
            this.setTokenButton.Text = "Set Token";
            this.setTokenButton.UseVisualStyleBackColor = true;
            this.setTokenButton.Click += new System.EventHandler(this.setTokenButton_click);
            // 
            // listExperimentsButton
            // 
            this.listExperimentsButton.Location = new System.Drawing.Point(336, 185);
            this.listExperimentsButton.Name = "listExperimentsButton";
            this.listExperimentsButton.Size = new System.Drawing.Size(132, 23);
            this.listExperimentsButton.TabIndex = 10;
            this.listExperimentsButton.Text = "List Experiment(s)";
            this.listExperimentsButton.UseVisualStyleBackColor = true;
            this.listExperimentsButton.Click += new System.EventHandler(this.listExperimentsButton_Click);
            // 
            // deployButton
            // 
            this.deployButton.Location = new System.Drawing.Point(12, 129);
            this.deployButton.Name = "deployButton";
            this.deployButton.Size = new System.Drawing.Size(138, 35);
            this.deployButton.TabIndex = 11;
            this.deployButton.Text = "Deploy";
            this.deployButton.UseVisualStyleBackColor = true;
            this.deployButton.Click += new System.EventHandler(this.deployButton_Click);
            // 
            // masterPackButton
            // 
            this.masterPackButton.Location = new System.Drawing.Point(628, 185);
            this.masterPackButton.Name = "masterPackButton";
            this.masterPackButton.Size = new System.Drawing.Size(75, 23);
            this.masterPackButton.TabIndex = 12;
            this.masterPackButton.Text = "Master Pack";
            this.masterPackButton.UseVisualStyleBackColor = true;
            this.masterPackButton.Click += new System.EventHandler(this.masterPackButton_Click);
            // 
            // masterWorkspaceIdBox
            // 
            this.masterWorkspaceIdBox.Location = new System.Drawing.Point(13, 264);
            this.masterWorkspaceIdBox.Name = "masterWorkspaceIdBox";
            this.masterWorkspaceIdBox.Size = new System.Drawing.Size(153, 20);
            this.masterWorkspaceIdBox.TabIndex = 13;
            // 
            // masterExperimentIdBox
            // 
            this.masterExperimentIdBox.Location = new System.Drawing.Point(189, 264);
            this.masterExperimentIdBox.Name = "masterExperimentIdBox";
            this.masterExperimentIdBox.Size = new System.Drawing.Size(153, 20);
            this.masterExperimentIdBox.TabIndex = 14;
            // 
            // createProjectButton
            // 
            this.createProjectButton.Location = new System.Drawing.Point(374, 261);
            this.createProjectButton.Name = "createProjectButton";
            this.createProjectButton.Size = new System.Drawing.Size(82, 23);
            this.createProjectButton.TabIndex = 15;
            this.createProjectButton.Text = "Create Project";
            this.createProjectButton.UseVisualStyleBackColor = true;
            this.createProjectButton.Click += new System.EventHandler(this.createProjectButton_Click);
            // 
            // deleteWorkspaceButton
            // 
            this.deleteWorkspaceButton.Location = new System.Drawing.Point(189, 223);
            this.deleteWorkspaceButton.Name = "deleteWorkspaceButton";
            this.deleteWorkspaceButton.Size = new System.Drawing.Size(132, 23);
            this.deleteWorkspaceButton.TabIndex = 17;
            this.deleteWorkspaceButton.Text = "Delete Workspace";
            this.deleteWorkspaceButton.UseVisualStyleBackColor = true;
            this.deleteWorkspaceButton.Click += new System.EventHandler(this.deleteWorkspaceButton_Click);
            // 
            // deleteWorkspacesButton
            // 
            this.deleteWorkspacesButton.Location = new System.Drawing.Point(336, 223);
            this.deleteWorkspacesButton.Name = "deleteWorkspacesButton";
            this.deleteWorkspacesButton.Size = new System.Drawing.Size(132, 23);
            this.deleteWorkspacesButton.TabIndex = 18;
            this.deleteWorkspacesButton.Text = "Delete Workspaces";
            this.deleteWorkspacesButton.UseVisualStyleBackColor = true;
            this.deleteWorkspacesButton.Click += new System.EventHandler(this.deleteWorkspacesButton_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(967, 626);
            this.Controls.Add(this.deleteWorkspacesButton);
            this.Controls.Add(this.deleteWorkspaceButton);
            this.Controls.Add(this.createProjectButton);
            this.Controls.Add(this.masterExperimentIdBox);
            this.Controls.Add(this.masterWorkspaceIdBox);
            this.Controls.Add(this.masterPackButton);
            this.Controls.Add(this.deployButton);
            this.Controls.Add(this.listExperimentsButton);
            this.Controls.Add(this.setTokenButton);
            this.Controls.Add(this.inputTextBox);
            this.Controls.Add(this.clearButton);
            this.Controls.Add(this.createWorkspaceButton);
            this.Controls.Add(this.outputTextBox);
            this.Controls.Add(this.tokenBox);
            this.Controls.Add(this.listWorkspacesButton);
            this.Controls.Add(this.getTokenButton);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Button getTokenButton;
        private Button listWorkspacesButton;
        private TextBox tokenBox;
        private TextBox outputTextBox;
        private Button createWorkspaceButton;
        private Button clearButton;
        private TextBox inputTextBox;
        private Button setTokenButton;
        private Button listExperimentsButton;
        private Button deployButton;
        private Button masterPackButton;
        private TextBox masterWorkspaceIdBox;
        private TextBox masterExperimentIdBox;
        private Button createProjectButton;
        private Button deleteWorkspaceButton;
        private Button deleteWorkspacesButton;
    }
}

