const multer = require('multer');

const fileUpload = () => {
    const storage = multer.diskStorage({});
    
    function fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image')) {
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
    
    const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 5 // 5MB limit per file (adjust as needed)
        }
    }).fields([{name:"photo_url",maxCount:7},{name:"details_images",maxCount:2}]) // 'images' is the field name for multiple file uploads, 10 is the maximum number of files
    
    return upload;
};

module.exports = fileUpload;



// const multer = require('multer');

// const fileUpload = () => {
//     const storage = multer.diskStorage({});
    
//     function fileFilter(req, file, cb) {
//         if (!file.mimetype.startsWith('image')) {
//             cb(null, false);
//         } else {
//             cb(null, true);
//         }
//     }
    
//     const upload = multer({ 
//         storage: storage,
//         fileFilter: fileFilter,
//         limits: {
//             fileSize: 1024 * 1024 * 5 // 5MB limit per file (adjust as needed)
//         }
//     }).array('images', 4); // 'images' is the field name for multiple file uploads, 10 is the maximum number of files
    
//     return upload;
// };

// module.exports = fileUpload;




// const multer = require('multer')

// const fileUpload = () => {
//     const storage = multer.diskStorage({
//     })
//     function fileFilter(req, file, cb) {
//         if (!file.mimetype.startsWith('image')) {
//             cb(null, false)
//         } else {
//             cb(null, true)
//         }
//     }
//     const upload = multer({ storage: storage, fileFilter })
//     return upload.single("image")
// }

// module.exports = fileUpload