// const { initializeApp } = require('firebase/app');
// const { 
//   getStorage, 
//   ref, 
//   uploadBytes, 
//   getDownloadURL, 
//   deleteObject,
//   listAll
// } = require('firebase/storage');
// const multer = require('multer');
// const path = require('path');

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// // Configure Multer
// const multerStorage = multer.memoryStorage();
// const upload = multer({ 
//   storage: multerStorage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|webp/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images only!');
//     }
//   }
// });

// class FirebaseStorageService {
//   static async uploadImage(file) {
//     try {
//       const dateTime = new Date().getTime();
//       const fileName = `${dateTime}-${file.originalname.replace(/\s/g, '_')}`;
//       const storageRef = ref(storage, `car-rental/${fileName}`);
      
//       // Upload the file
//       const snapshot = await uploadBytes(storageRef, file.buffer, {
//         contentType: file.mimetype,
//       });
      
//       // Get the URL
//       const downloadURL = await getDownloadURL(snapshot.ref);
      
//       return {
//         url: downloadURL,
//         path: snapshot.ref.fullPath
//       };
//     } catch (error) {
//       throw new Error(`Image upload failed: ${error.message}`);
//     }
//   }

//   static async uploadMultipleImages(files) {
//     try {
//       const uploadPromises = files.map(file => this.uploadImage(file));
//       const results = await Promise.all(uploadPromises);
//       return results;
//     } catch (error) {
//       throw new Error(`Multiple image upload failed: ${error.message}`);
//     }
//   }

//   static async deleteImage(imagePath) {
//     try {
//       const imageRef = ref(storage, imagePath);
//       await deleteObject(imageRef);
//       return { success: true, message: 'Image deleted successfully' };
//     } catch (error) {
//       throw new Error(`Image deletion failed: ${error.message}`);
//     }
//   }

//   static async deleteMultipleImages(imagePaths) {
//     try {
//       const deletePromises = imagePaths.map(path => this.deleteImage(path));
//       const results = await Promise.all(deletePromises);
//       return results;
//     } catch (error) {
//       throw new Error(`Multiple image deletion failed: ${error.message}`);
//     }
//   }

//   static async updateImage(oldImagePath, newFile) {
//     try {
//       // Delete the old image
//       await this.deleteImage(oldImagePath);
//       // Upload the new image
//       return await this.uploadImage(newFile);
//     } catch (error) {
//       throw new Error(`Image update failed: ${error.message}`);
//     }
//   }

//   static async getAllImages(folderPath = 'car-rental') {
//     try {
//       const folderRef = ref(storage, folderPath);
//       const result = await listAll(folderRef);
      
//       const urls = await Promise.all(
//         result.items.map(async (itemRef) => {
//           const url = await getDownloadURL(itemRef);
//           return {
//             url,
//             path: itemRef.fullPath
//           };
//         })
//       );
      
//       return urls;
//     } catch (error) {
//       throw new Error(`Failed to get images: ${error.message}`);
//     }
//   }
// }

// // Middleware for handling multiple image uploads
// const uploadCarImages = upload.array('images', 10);

// // Middleware for handling single image upload
// const uploadSingleImage = upload.single('image');

// module.exports = {
//   FirebaseStorageService,
//   uploadCarImages,
//   uploadSingleImage
// };