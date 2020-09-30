import React, { useState, useEffect } from 'react'
import { Upload, message, Avatar, Badge, Card } from 'antd'
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';  
import { getImageAttachedImage, attachImage } from '../../Template/service';
import { getBase64 } from '@/utils/utils';
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

const AttachImage = ({currentUser,getUpdatedDoc , styles}) => {




    const [isUploading, setIsUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const getImg = (id) =>getImageAttachedImage({id:id}).then(x=>x?getBase64(x,u=>setImageUrl(u)):null)
  
useEffect(() => {
    getImg(currentUser._id)
    .then(getUpdatedDoc(currentUser))
}, [imageUrl,isUploading])


    const handleimageUpload = data => {
        console.log('uploading');
            console.log(data);
            return attachImage(data).then(res=>{getImg(currentUser._id);return res})
      }; 
    
      const handleUploadChange = info => {
          console.log(info,currentUser);    
        if (info.file.status === 'uploading') {
          setIsUploading(true)
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
    
          getBase64(info.file.originFileObj, imageUrl =>{
            message.success('Image upload successful')
            // setImageUrl(imageUrl)
            setIsUploading(false)
            console.log(info.file.originFileObj);
            handleimageUpload({file:info.file.originFileObj,_id:currentUser._id, _rev:currentUser._rev, filetype:info.file.originFileObj.type})
          }
          );
        }
      };

      const uploadButton = (
        <div>
          {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    return (
        <>
          <div className={styles.avatar_title}>Avatar</div>
          <div className={styles.avatar}>
            <img src={imageUrl} alt="avatar" />
          </div>
          <Upload
            accept="image/*"
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleUploadChange}
        data={{_id:currentUser && currentUser._rev,_rev:currentUser && currentUser._rev}}
      >
        {uploadButton}
      </Upload>
        </>
    )
}

export default AttachImage
