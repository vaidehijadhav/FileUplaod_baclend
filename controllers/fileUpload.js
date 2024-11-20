const File = require("../models/File");

// localfileupload -> handler function
exports.localFileUpload = async (req, res) => {
    try{
        // fetch file
        const file = req.files.file;
        console.log("File Aagayi -> ", file);

        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("Path -> ", path);

        file.mv(path, (err) => {
            console.log(err);
        });

        res.json({
            success:true,
            message:'Local File Upload successfully',
        }); 

    }
    catch(err){
        console.log(err);
    }
}