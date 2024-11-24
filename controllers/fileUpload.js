const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

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

function isFileTypeSupported(type, supportTypes){
    return supportTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder){
    const options = {folder};
    console.log("temp file path", file.tempFilePath);
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload ka handler
exports.imageUpload = async (req, res) => {
    try{
        // data fetch
        const {name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(! isFileTypeSupported(fileType, supportTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        // file format supported
        console.log("Uploading to FileUpload")
        const response = await uploadFileToCloudinary(file, "fileUpload");
        console.log(response);

        // db mai entry save krni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })
        
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        });
    }
}

// video upload krne ka handler
exports.videoUpload = async (req, res) => {
    try{
        // data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

        // validation
        const supportTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        // TODO: add a upper limit of 5MB for video

        if(!isFileTypeSupported(fileType, supportTypes)){
            return res.status(400).json({
                success:false,
                message:'File Format not supported',
            })
        }

        // file format supported  hai
        console.log("Uploading to fileUpload");
        const response = await uploadFileToCloudinary(file, "fileUpload");
        console.log(response);

        // db mai entry save krni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Video Successfully uploaded',
        })

    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}