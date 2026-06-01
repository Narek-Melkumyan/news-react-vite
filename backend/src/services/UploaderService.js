import multer from "multer";
import sharp from "sharp";
import {r2} from "../../config/app.js";
import {PutObjectCommand} from "@aws-sdk/client-s3";
const storage = multer.memoryStorage();
export  const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // max 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images are allowed"));
        }

        cb(null, true);
    },
});


export async function fileUpload(file,org=null) {
    if(file) {
        const safeName = file.originalname
            .split(".")[0]
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-_]/g, "")
            .toLowerCase();

        const fileName = `articles/${Date.now()}-${safeName}.webp`;

        const optimizedImage = await sharp(file.buffer)
            .resize({
                width: 1200,
                height: 700,
                fit: "cover",
                withoutEnlargement: true,
            })
            .webp({
                quality: 75,
            })
            .toBuffer();

        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: optimizedImage,
                ContentType: "image/webp",
            })
        );

        return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    }
    return org;
}