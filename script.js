const PauseBtn = document.getElementById("Pause");
const InputMusic = document.getElementById("InputMusic");
const ProgressBarLine = document.getElementById("line");
const ProgressBar = document.getElementById("ProgressBar");
const InfoDurationTime = document.getElementById("DurationTime");
const InfoCurrentTime = document.getElementById("CurrentTime");
const BackBtn = document.getElementById("Back");
const NextBtn = document.getElementById("Next");
const SongList = document.getElementById("List");
const AllSongs = document.querySelectorAll(".Songs");
const SongNameInfo = document.getElementById("SongNameInfo");
const ArtistNameInfo = document.getElementById("ArtistNameInfo");
const MusicImg = document.getElementById("MusicImg");
const ReturnSongBtn = document.getElementById("ReturnSongBtn");
const ShuffleBtn = document.getElementById("ShuffleBtn");

const audio = new Audio();

const jsmediatags = window.jsmediatags;


  SongList.addEventListener("click", function (event){
    let index = event.target.dataset.index;
    let song = SongsUsers[index];

    SongNameInfo.textContent = song.name || `Song name not found`;
    ArtistNameInfo.textContent = song.artist || "Artist name not found"
   if(song.picture){  
    let base64String = ''
     
     for(let i =0; i < song.picture.data.length; i++){
      base64String += String.fromCharCode(song.picture.data[i]);
     }
    MusicImg.src = `data:${song.picture.format};base64,${window.btoa(base64String)}` 
    }else{
      MusicImg.src = 'MusicPhoto.jpg'
    }
//    MusicImg.src = song.picture

    PauseBtn.textContent ='⏸';
    ChekerClick = true;

    audio.src = song.path;
    audio.play();
  })

let SongsUsers = []

//let Remember = JSON.parse(localStorage.getItem("songs")) || []

let ChekerClick = false
let CheketReturnSong = false
let ChekerShuffleSong = false
let DurationMinuts = 0;
let CurrentMinuts = 0;
let BarWidth

InfoDurationTime.textContent = `00:00`

PauseBtn.addEventListener('click', Pause);
BackBtn.addEventListener('click', BackTime);
NextBtn.addEventListener('click', NextTime);
ProgressBar.addEventListener('click', ProgressTime);
ReturnSongBtn.addEventListener('click', ReturnMusic);
ShuffleBtn.addEventListener('click', ShuffleMusic)

function ShuffleMusic(){
  ChekerShuffleSong = !ChekerShuffleSong;

 if(ChekerShuffleSong){
  ShuffleBtn.style.backgroundColor = 'rgb(255, 68, 0)'; 

  CheketReturnSong = false;
  ReturnSongBtn.style.backgroundColor = 'white';
 }else{
  ShuffleBtn.style.backgroundColor = 'white';
 }
}

audio.addEventListener('ended', () => {
  if(!ChekerShuffleSong) return;
  if (SongsUsers.length === 0) return;

  let lengthNumberIndex = Math.floor(Math.random() * SongsUsers.length);
  let RandomSong = SongsUsers[lengthNumberIndex];

  if (!RandomSong || !RandomSong.path) return;

  audio.src = RandomSong.path;
  audio.currentTime = 0;

  SongNameInfo.textContent = RandomSong.name || `Song name not found`;
  ArtistNameInfo.textContent = RandomSong.artist || "Artist name not found";

   if (RandomSong.picture){   
   let base64String = ''
     
     for(let i =0; i < RandomSong.picture.data.length; i++){
      base64String += String.fromCharCode(RandomSong.picture.data[i]);
     }
    MusicImg.src = `data:${RandomSong.picture.format};base64,${window.btoa(base64String)}` 
    }else{
      MusicImg.src = 'MusicPhoto.jpg'
    }
  PauseBtn.textContent ='⏸';
  ChekerClick = true;

  audio.play();
})

function ReturnMusic(){
 if(!CheketReturnSong){
  CheketReturnSong = true;
 
  ReturnSongBtn.style.backgroundColor = 'rgb(255, 68, 0)';
   
  ChekerShuffleSong = false;
  ShuffleBtn.style.backgroundColor = 'white';
 }else{
  ReturnSongBtn.style.backgroundColor = 'white';
  CheketReturnSong = false;
 }
}

audio.addEventListener('ended', () => {
 if(CheketReturnSong){
  audio.currentTime = 0;
  PauseBtn.textContent ='⏸';
  ChekerClick = true;
  audio.play();
}})

function Pause(){
  if(!audio.src){
    alert('Please seclect music')
    return
  }else{
    if(ChekerClick){
        PauseBtn.textContent = '▶'
        ChekerClick = false;
        audio.pause();
    }else{
        PauseBtn.textContent = '⏸'
        ChekerClick = true;
        audio.play();
    }
  }
}

function BackTime(){
  if(audio.currentTime < 2){
    return
  }else{
   audio.currentTime -= 5;
  }
}

function NextTime(){
   audio.currentTime += 5;
}

function ProgressTime(e){
  let ProgressValue = ProgressBar.clientWidth;
  let cliclOfSetX = e.offsetX;
  let MusicDuration = audio.duration;
 if(audio.currentTime != cliclOfSetX){
  audio.currentTime = (cliclOfSetX / ProgressValue) * MusicDuration;
  }else{
    return;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === " "){
     if(ChekerClick){
        PauseBtn.textContent = '▶'
        ChekerClick = false;
        audio.pause();
    }else{
        PauseBtn.textContent = '⏸'
        ChekerClick = true;
        audio.play();
    }
  }else if(e.key === "ArrowRight"){
    audio.currentTime += 5;
  }else if(e.key === "ArrowLeft"){
    audio.currentTime -= 5;
  }
});

InputMusic.addEventListener('change', () =>{ /*'change' — це подія, вона спрацьовує, коли елемент змінився.*/   
  ProgressBarLine.style.width = "0%"; 
   PauseBtn.textContent = '▶'
   ChekerClick = false;
   audio.currentTime = 0;
   audio.pause();

   const music = InputMusic.files[0];
   let url = audio.src = URL.createObjectURL(music);

   jsmediatags.read(music, {
    onSuccess: function(tags){
    const title = tags.tags.title || music.name;

    if(SongsUsers.some(song => song.name === title)){
     alert("this music are here!");
     return;
    }

    SongsUsers.push({
    // picture:imageBase64,
     picture:tags.tags.picture,
     artist:tags.tags.artist,
     name:tags.tags.title,
     path: url
   })
//    localStorage.setItem("songs", JSON.stringify(SongsUsers));

    let index = SongsUsers.length - 1;
    
   // SongNamePlayList(tags.tags.title, index)
    
     let imageBase64 = null;

     if (tags.tags.picture){
      const data = tags.tags.picture.data;
      const format = tags.tags.picture.format;
      let base64String = ''
     
     for(let i =0; i < data.length; i++){
      base64String += String.fromCharCode(data[i]);
     }
    // if(base64String){
      imageBase64 = `data:${format};base64,${window.btoa(base64String)}` 
      MusicImg.src = `data:${format};base64,${window.btoa(base64String)}` 
    /* }else{
      MusicImg.src = 'MusicImg.jpg'
     }*/
    }else{
      MusicImg.src = 'MusicPhoto.jpg'
    }
     if(tags.tags.artist != undefined){
      ArtistNameInfo.textContent = tags.tags.artist;
     }else{
      ArtistNameInfo.textContent = "Artist name not found";
     }

     if(tags.tags.title != undefined){
      SongNameInfo.textContent = tags.tags.title;
//      SongNamePlayList(tags.tags.title)
      SongNamePlayList(tags.tags.title, index)
    }else{
      SongNameInfo.textContent = "Song name not found";
      SongNamePlayList("Song name not found", index);
    }

    /* SongsUsers.push({
   //  picture:imageBase64,
     picture:tags.tags.picture,
     artist:tags.tags.artist,
     name:tags.tags.title,
     path: url
   })
    localStorage.setItem("songs", JSON.stringify(SongsUsers));
  */
//    console.log(Remember)
    },
    onError: function(error){
      console.log(error);
    }
   })
   /*console.log(music.name)*/
   /*MusicImg.src = song.img = "default.jpg"*/
  function SongNamePlayList(e, index){
   SongList.insertAdjacentHTML('afterbegin', `
      <li class="Songs" data-index="${index}">${e}</li>
    `)
  }
   /*console.log(SongsUsers)*/

   InfoDurationTime.textContent = `00:00`
});

audio.addEventListener('timeupdate', (e) =>{ /*timeupdate - це подія, вона спрацювує кожну секунду при зміні даних*/
   if (audio.duration){ 
    BarWidth = (audio.currentTime / audio.duration) * 100;
   }
   ProgressBarLine.style.width = BarWidth + "%" ;

   let DurationTimeSong = e.target.duration;
   let CurrentTimeSong = e.target.currentTime;
  
//   let Minuts = DurationMinuts * 60;

   /*console.log(e)*/
   DurationMinuts = Math.floor(DurationTimeSong / 60);
   DurationTime = Math.floor(DurationTimeSong % 60);
   
   let MinutsAllSong
   let SecondAllSong
  function DurationInfo(){
   if(DurationMinuts < 10){
    MinutsAllSong = "0" + DurationMinuts; 
   }else{
    MinutsAllSong = DurationMinuts; 
   }
   if(DurationTime < 10){
    SecondAllSong = "0" + DurationTime;
   }else{
    SecondAllSong = DurationTime;
   }
   InfoDurationTime.textContent = MinutsAllSong + ":" + SecondAllSong;
   }
   
  function CurrentInfo(){
   let SecondCurrentFloor = Math.floor(CurrentTimeSong);
   let MinutsCurrent = Math.floor(SecondCurrentFloor / 60);
   let SecondCurrent = SecondCurrentFloor % 60;
   
   if (SecondCurrent < 10) {
      SecondCurrent = "0" + SecondCurrent;
   }
   if(MinutsCurrent < 10){
    MinutsCurrent = "0" + MinutsCurrent
   }
   InfoCurrentTime.textContent = MinutsCurrent + ":" + SecondCurrent;
  }
function ChekerMusic(){
  if(CurrentTimeSong === DurationTimeSong){
   PauseBtn.textContent = '▶';
   ChekerClick = false;
  }/*else if(CurrentTimeSong === 0){
    PauseBtn.textContent ='⏸';
    ChekerClick = true;
  }*/
}  
  ChekerMusic();
  DurationInfo();
  CurrentInfo();
});
