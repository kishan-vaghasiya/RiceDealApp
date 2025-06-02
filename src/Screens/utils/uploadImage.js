const uploadImageToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'chat-image.jpg',
    }); // cast to avoid TS warning

    data.append('upload_preset', 'YOUR_UPLOAD_PRESET');
    data.append('cloud_name', 'drwv6ap7i');

    try {
        const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
            method: 'POST',
            body: data,
        });

        const json = await res.json();
        console.log('Cloudinary Upload Success:', json);
        return json.secure_url; // This is the public URL
    } catch (err) {
        console.error('Cloudinary Upload Failed:', err);
        return null;
    }
};
