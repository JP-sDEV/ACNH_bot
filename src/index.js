import fs from "fs"
import path from "path"
import axios from "axios"
import cron from "cron"
import {TwitterClient, RedditClient} from "./utility/auth"

const init = () => {
    const path = "./src/temp_image"
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
      fs.writeFileSync(`${path}/info.json`, "{}", (err) => {
        if (err) throw err;
      })
      fs.writeFileSync(`${path}/a.jpg`, null, (err) => {
        if (err) throw err;
      })
    }
}

const save_image = async (url, post_id) => {
    const response = await axios.get(url, {responseType: "stream"})
    const image_path = path.join(__dirname, "temp_image", `${post_id}.jpg`)
    const writer = fs.createWriteStream(image_path)
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
  }

const delete_image = (file_path) => {
  if (path.extname(file_path) == ".jpg") {
    fs.unlinkSync(file_path, (err)=> {
      if (err) throw err
    }) 
  }
}

const write_info = (incoming_file) => {
  const info_path = path.join(__dirname, "temp_image/info.json")
  fs.writeFileSync(info_path, JSON.stringify(incoming_file), (err) => {
    if (err) throw err
    return 
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
  var incoming_posts
  await RedditClient.getSubreddit('animalcrossingmeme').getNew({time: "day"}).then(r => incoming_posts= r)
  const image_path = path.join(__dirname, "temp_image/")

  var full_path;
  fs.readdir(image_path, (err, files) => {
    if (err) throw err
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
        save_image(file.url, file.id)
        write_info(file)
        break
      }
      continue
    }
  })
}

const get_file = () => {
    const info_path = "./src/temp_image/info.json"
    const temp_image_data = JSON.parse(fs.readFileSync(info_path, "utf8"));
    var info = {
      title: null,
      image_path: null
    }
    var path_name = path.join(__dirname, "temp_image")
    var files = fs.readdirSync(path_name)
    info.title =  temp_image_data.title
      for (let i = 0; i < files.length-1; i++) {
        let file = files[i]
        if (path.extname(file) == ".jpg") {
        info.image_path = (`${path_name}/${file}`)
        }
      }
    return(info)
}

const main = async () => {
  init()
  await fetch_image()
  var info = get_file()
  post_to_twitter(info)
}

const job = new cron.CronJob("0 */2 * * *", () => {
  main()
})

job.start()