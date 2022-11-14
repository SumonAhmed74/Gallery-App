import React, { useEffect, useState } from 'react'
import {Alert} from '@mui/material'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {RiImageAddFill} from 'react-icons/ri'
import {AiOutlineLogout} from 'react-icons/ai'
import {ImHappy2} from 'react-icons/im'
import {Modal,Backdrop,Fade,Typography,Box,Button} from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as fref, set,push} from "firebase/database";
import { getDatabase as ngetDatabase, ref as nref, onValue} from "firebase/database";
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector, useDispatch } from 'react-redux'
import { imagesReducer } from '../reducer/imgSlice';
import { Link } from 'react-router-dom';


const HomePage = () => {
    const auth=getAuth();
    const storage = getStorage();
    const db = getDatabase();
    const ndb = ngetDatabase();
    const dispatch = useDispatch();
    const [emailVerify,setEmailVerify] = useState(false)
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [file,setFile] = useState(null)
    const [galleryImg,setGalleryImg]=useState([])
    const [progress,setProgress]=useState(null)

    const handleClose = () => setOpen(false);
    const handleClose2 = () => setOpen2(false);

    const gallery = useSelector((state)=>state.image.value)

    const imageUploadHandler=()=>{
      setOpen(true)
    }

    useEffect(()=>{
      const galleryImagesRef = nref(ndb, 'galleryImg/');
        onValue(galleryImagesRef, (snapshot) => {
          const galleryArr=[];
          snapshot.forEach((item)=>{
           if(item.val().id==auth.currentUser.uid){
              galleryArr.push({
                id: item.key,
                image: item.val().image,
              })
           }
           
          })
          setGalleryImg(galleryArr)
        });
    },[])
    

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
          if (user) {
           setEmailVerify(user.emailVerified)
          } else {
            console.log("not verifyed!")
          }
        });
      },[auth])

      const galleryImgUpload=()=>{
        const galleryImgRef = ref(storage, 'galleryImages/'+file.name);

      const uploadTask = uploadBytesResumable(galleryImgRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setProgress(progress)
        }, 
        (error) => {
          console.log(error)
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            set(push(fref(db, 'galleryImg/')), {
              image:downloadURL,
              id:auth.currentUser.uid,
            }).then(()=>{
              console.log("realtime send sunccessful!")
              setProgress(null)
              setOpen(null)
            })
          });
        }
      );
      }


      const imgOpenHandler=(items)=>{
        // console.log(items.image)
        dispatch(imagesReducer(items.image))
          setOpen2(true)
      
      }
     
  return (
    <div>
        {emailVerify
        ?
        <div className='HomePageBox'>
          <div className='logoutBox'>
          <h4>LogOut</h4>
          <Link to={'/login'}>
          <AiOutlineLogout className='logIcon'/>
          </Link>
           
          </div>
          <div className='iconBox'>
           
            <div className='box'>
              <RiImageAddFill className='uploadIcon' onClick={imageUploadHandler} />
              <h2>Wellcome {auth.currentUser.displayName} <ImHappy2 style={{color:'#FBBC04'}}/></h2>
              <h3>Look down an example of Gallery
                please add your Images:
              </h3>
            </div>
          <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box sx={style} style={{textAlign:"center"}}>
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                    Upload Your Gallery Photos:
                  </Typography>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    <input type="file" style={{marginBottom:"10px"}} onChange={(e)=>setFile(e.target.files[0])}/>
                    {progress>0 &&
                      <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                    }
                   {progress>0 ?
                      <Button onClick={galleryImgUpload} style={{marginTop:"25px",width:"100%"}} variant="contained" disableElevation>
                      Uploading...
                    </Button>
                    :
                    <Button onClick={galleryImgUpload} style={{marginTop:"25px",width:"100%"}} variant="contained" disableElevation>
                      Upload Image
                    </Button>
                   }
                    
                  </Typography>
                </Box>
              </Fade>
            </Modal>
          </div>
          <div className='imgBox'>
            {galleryImg.map((items)=>(
              <img onClick={()=>imgOpenHandler(items)} src={items.image}/>
            ))}
           
               <Modal
                  open={open2}
                  onClose={handleClose2}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  
                  <Box sx={style2}>
                  <img className='modalImg' style={{width:"100%",height:"100%"}} src={gallery}/>
                  </Box>
                  
                </Modal>
               
            
          </div>
        </div>
        :
        <Alert className='verifyAlert' variant="filled" severity="warning">
        Warning! Plesae Check Your Email-Verifications!
       </Alert>   
        }
      
    </div>
  )
}


const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 580,
  bgcolor: 'background.paper',
  boxShadow: 24,
  border: '1px solid #000',
};

export default HomePage
