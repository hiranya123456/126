import * as React from "react";
import { Button, Image, View, Platform } from "react-native";import * as ImagePicker from 'expo-image-picker'
import * as Permissions  from 'expo-permissions'

export default class PickImage extends React.Component {
  state = {
   image:null
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
   if(Platform.OS!=="web"){
     const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
     if(status!=="granted"){
       alert("sorry we need a camera to make this work")
     }
   }
  };

  uploadImage = async (uri) => {
    const data=new FormData();
    let filename=uri.split("/")[uri.split("/").length-1]
    let type=`image/ $ {uri.split('.')[uri.split('.').length-1]}`
    var fileupload={
      uri:uri,
      name:filename,
      type:type
    }
data.append("alphabets",fileupload);
fetch("https://c891-103-159-32-50.ap.ngrok.io  /predict-alphabets",{
  method:"POST",
  body:data,
  headers:{
    "content-type":'multipart/form-data'
  }
})
.then((response)=>response.json())
.then((result)=>{
  console.log("success")

})
.catch((error)=>{
  console.log("error")
})
  };

    _pickImage = async () => {
     try{
       let result=await ImagePicker.launchImageLibraryAsync({
         mediaTypes:ImagePicker.MediaTypeOptions.All,
         allowEditiong:true,
         aspect:[4,3],
         quality:1
       })
       if(!result.cancelled){
         this.setState({
           image:result.data
         })
         console.log(result.uri)
         this.uploadImage(result.uri);
       }
     }
     catch(E){
       console.log(E)
     }
    };
}
