import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { Modal, Form, Input, Button, Upload } from "antd"

const firebaseConfig = {
    apiKey: "AIzaSyBJIQ74zCvM44GasUWMXLg8ep2UJjOdAWU",
    authDomain: "upload-storage-cgl.firebaseapp.com",
    projectId: "upload-storage-cgl",
    storageBucket: "upload-storage-cgl.appspot.com",
    messagingSenderId: "962607657269",
    appId: "1:962607657269:web:df842f1522757ad33f1c7c"
  };

export default function UploadModal({ setShowUpload, setPhotoList }) {
    const handleNewPhoto = (values) => {
        console.log(values)
        //0.Connect to firebase storage 
        const app = initializeApp(firebaseConfig)
        const storage = getStorage(app)
        //1. Upload photo to storage bucket
        const filename = values.photo.file.name.originFileObj 
        const imageRef = ref(storage, `photos/${filename}`)
        uploadBytes(imageRef, values.photo.file)
            .then(() => console.log("upload successful"))
            .catch(err => console.error(err))
        //2 Figure out URL for that photo
        const photoUrl = `https://firebasestorage.googleapis.com/v0/b/upload-storage-cgl.appspot.com/o/photos%2F${filename}?alt=media`
        //3. Put that URL in to new photo object
        let newPhotoObj = values
        newPhotoObj.photo = photoUrl
        //4. Send a post request to API
        fetch('https://express-ts-cgl.web.app/photos', {
            // fetch('http://localhost:5002/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newPhotoObj)
        })
        .then(results => results.json())
        .then(newListOfPhotos => {

            //5. Get back new list of photos
            setPhotoList(newListOfPhotos)
            //6. setPhotolist and close Modal
            closeModal()
        })
        .catch(alert)
    }
    const closeModal = () => setShowUpload(false)
    return (
        <Modal title="Upload Photo" open={true} footer={null} onCancel={closeModal}>
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={handleNewPhoto}>
                <Form.Item label="User Name" name="username">
                    <Input required />
                </Form.Item>
                <Form.Item label="Profile Picture URL" name="profilePic">
                    <Input required />
                </Form.Item>
                <Form.Item label="Photo" name="photo">
                   <Upload listType="picture-card">+</Upload>
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={4} required />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">Save Photo</Button>
                </Form.Item>
            </Form>

        </Modal>
    )
}