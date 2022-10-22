import storage from "../services/firebase";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

export class FirebaseService {
  static async uploadFile(file: Express.Multer.File, path: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);

      const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
        contentType: file.mimetype,
      });

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.log(error);
          reject();
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  }
}
