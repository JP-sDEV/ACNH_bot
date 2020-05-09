// import "core-js/stable";
import "regenerator-runtime/runtime";

import fs from "fs"
import path from "path"
import axios from "axios"
import {TwitterClient, RedditClient} from "./utility/auth"

const init = () => {
    const image_path = ("./src/temp_image")

    if (!fs.existsSync(image_path)) {
      fs.mkdirSync(image_path)
      fs.writeFileSync(`${image_path}/info.json`, "{}", (err) => {
        if (err) throw err;
      })
      fs.writeFileSync(`${image_path}/a.jpg`, null, (err) => {
        if (err) throw err;
      })
    }
}

const save_image = async (url, post_id) => {
    const response = await axios.get(url, {responseType: "stream"})
    const image_path =(`./src/temp_image/${post_id}.jpg`)

    const writer = fs.createWriteStream(image_path)
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
  }

const delete_image = async (file_path) => {
  if (path.extname(file_path) == ".jpg") {
    await fs.unlinkSync(file_path, (err)=> {
      if (err) throw err
    }) 
  }
}

const write_info = async (incoming_file) => {
  const info_path =("./src/temp_image/info.json")
  await fs.writeFileSync(info_path, JSON.stringify(incoming_file), (err) => {
    if (err) throw err
  })
}

const post_to_twitter = (tweet_info) => {
  const b64content = fs.readFileSync(tweet_info.image_path, {encoding: "base64"})
  TwitterClient.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var altText = "animal crossing meme from reddit"
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
   
    TwitterClient.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: `${tweet_info.title}\n\n\n#AnimalCrossing\n#ACNH\n#NintendoSwitch`, media_ids: [mediaIdStr] }
   
        TwitterClient.post('statuses/update', params, function (err, data, response) {
        })
      }
    })
  })
}

const fetch_image = async () => {
  try {
    var incoming_posts
    incoming_posts = await RedditClient.getSubreddit('animalcrossingmeme').getNew({time: "day"})
    const image_path = ("./src/temp_image/")
    var full_path;
    const files = fs.readdirSync(image_path)
    for (const dir_file of files) {
      if (path.extname(dir_file) == ".jpg"){
        full_path = `${image_path}${dir_file}`
      }
    }
    const filename = path.basename(full_path, path.extname(full_path))

    for (let i = 0; i < incoming_posts.length-1; i++) {
      const file = incoming_posts[i]
      if (file.id !== filename && file.is_video == false) {
        delete_image(full_path)
        write_info(file)
        await save_image(file.url, file.id)
        break
      }
      continue
    }
  }
  catch (err) {
    console.log(err)
  }
}

const get_file = () => {
  const info_path = ("./src/temp_image/info.json")
  const temp_image_data = JSON.parse(fs.readFileSync(info_path, "utf8"));
    var info = {
      title: null,
      image_path: null
    }
    var path_name = ("./src/temp_image")
    info.title =  temp_image_data.title
    fs.readdirSync(path_name).forEach((file) => {
      if(path.extname(file) == ".jpg") {
        info.image_path = `${path_name}/${file}`
      }
    })
    return(info)
}

const main = async () => {
  try {
    init()
    console.log("before: ", get_file())
    await fetch_image()
    console.log("after: ", get_file())
    const info = get_file()
    // post_to_twitter(info)
  } 
  catch (err) {
    console.log(err)
  }
}
main()