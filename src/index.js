import "core-js/stable";
import "regenerator-runtime/runtime";

import fs from "fs"
import axios from "axios"
import {TwitterClient, RedditClient, S3Client} from "./utility/auth"

const get_info = async () => {  // returns info.json from AWS
  try {
    const params = {
      Bucket: "acnh-bot",
      Key: "info.json"
    }
     const request = await S3Client.getObject(params)
     const result = request.promise()
     return result
  }
  catch(err) {
    console.log(err)
  }
}

const get_new_posts = async () => { // script to renew info.json, and image on AWS
  try {
    var incoming_posts
    incoming_posts = await RedditClient.getSubreddit('animalcrossingmeme').getNew({time: "day"})
    const current_info = await get_info().then(data => JSON.parse(data.Body))
    for (let i = 0; i < incoming_posts.length-1; i++) {
      const post = incoming_posts[i]
      if (post.id !== current_info.id && post.is_video == false && post.media == null) {
        await delete_current_image(current_info.id)
        write_new_info(post)
        save_new_image(post.id, post.url)
        break
      }
      continue
    }
  }
  catch (err) {
    console.log(err)
  }
}

const save_new_image = async (image_id, image_url) => { // save locally and to upload to AWS
  try {
    const response = await axios.get(image_url, {responseType: "stream"})
    const image_path =(`./src/temp_image/${image_id}.jpg`)
    const params = {
      Bucket: "acnh-bot",
      Key: `${image_id}.jpg`,
      Body: null
    }
    const writer = fs.createWriteStream(image_path)
    response.data.pipe(writer)
  
    writer.on('finish', () => {
  
      const open_file = fs.readFileSync(image_path)
      params.Body = open_file
    
      S3Client.upload(params, (data, err) => {
        if(err) console.log(err)
        console.log("IMAGE upload success")
      })
    })
  } 
  catch(err) {
    console.log(err)
    }
  }
  

  const delete_current_image = async (image) => { // script to remove current image in AWS
    try{
      const params = {
        Bucket: "acnh-bot",
        Key: `${image}.jpg`
      }
    
      await S3Client.deleteObject(params, (err) => {
        if (err) console.log(err)
    
        console.log("CURRENT IMAGE delete success")
      })
    }
    catch(err) {
      console.log(err)
    }
  }
  
  const write_new_info = (new_info) => { // script to upload info.json from local to AWS
    const params = {
      Bucket: "acnh-bot",
      Key: "info.json",
      Body: JSON.stringify(new_info)
    }
  
    S3Client.upload(params, (data, err) => {
      if(err) console.log(err)
      console.log("INFO.JSON upload success")
    })
  }
  
  const post_to_twitter = async () => {
    try{
      const current_info = await get_info().then(data => JSON.parse(data.Body))
      const b64content = fs.readFileSync(`./src/temp_image/${current_info.id}.jpg`, {encoding: "base64"})
      TwitterClient.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var altText = "animal crossing meme from reddit"
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    
        TwitterClient.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: `${current_info.title}\n\n\n#AnimalCrossing\n#ACNH\n#NintendoSwitch`, media_ids: [mediaIdStr] }
       
            TwitterClient.post('statuses/update', params, function (err, data, response) {
            })
          }
        })
      })
    }
    catch(err) {
      console.log(err)
    }
  }

  
const main = async () => {
  try {
    await get_new_posts()
    const info = await get_info()
    post_to_twitter(info)
  }
  catch(err) {
    console.log(err)
  }
}

main()
