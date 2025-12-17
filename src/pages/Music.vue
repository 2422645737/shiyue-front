<template>
    <div class="main">
        <el-header>
            <my-header></my-header>
        </el-header>
        <el-container>
            <div class="box">
                <div class="music_list_div">
                    <table class="music_list" cellspacing="0" cellpadding="0">
                        <tr>
                            <th class="table_head">  </th>
                            <th class="table_head">歌曲</th>
                            <th class="table_head">歌手</th>
                            <th class="table_head">时长</th>
                        </tr>
                        <tr v-for="item in music" :key="item.mid" class="music_line" @click="selectMusic(item)">
                            <td class="table_item" style="width: 5%">
                                <img class="playing_icon" v-show="current_music != undefined && current_music.mid === item.mid" src="../../public/images/wave.gif">
                            </td>
                            <td class="table_item" style="width: 35%">{{item.music_name}}</td>
                            <td class="table_item" style="width: 25%">{{item.singer}}</td>
                            <td class="table_item" style="width: 15%">{{item.durationStr}}</td>
                        </tr>
                    </table>

                </div>
<!--                音乐详情区域-->
                <div class="music_info_div">
                    <div class="music_surface">
                        <img class="music_logo" alt="" :src="this.current_music.surface"/>
                    </div>
                    <div class="music_lyric">
                        <div class="not_current">{{this.current_lrc.prev1}}</div>
                        <div class="not_current">{{this.current_lrc.prev2}}</div>
                        <div class="current_lrc">{{this.current_lrc.current}}</div>
                        <div class="not_current">{{this.current_lrc.next1}}</div>
                        <div class="not_current">{{this.current_lrc.next2}}</div>
                    </div>
                </div>
            </div>
<!--            底层控制区域-->
            <div class="control_div">
<!--                播放控制-->
                <audio ref="audio">
                </audio>
                <div class="play_control">
                    <button class="prev_button control_button" @click="prevMusic"></button>
                    <button :class="playing ? 'pause_button' : 'play_button'" @click="playMusic" ref="playButton"></button>
                    <button class="next_button control_button" @click="nextMusic"></button>
                </div>
<!--                进度条-->
                <div class="progress_bar">
                    <div class="title">
                        <div>
                            <label>{{current_music.music_name}}</label>
                            <label v-if="JSON.stringify(this.current_music) !== '{}'">&nbsp;-&nbsp;</label>
                            <label>{{current_music.singer}}</label>
                        </div>
                        <label >{{this.translateDuration(Math.ceil(this.current_time))}}/{{current_music.durationStr}}</label>
                    </div>
                    <div>
                        <progress :value="this.current_time" :max="this.current_music.duration" class="bar" ref="bar" ></progress>
                    </div>
                </div>
                <div class="other_control">
                    <button class="repeat control_button"></button>
                    <button class="volume control_button"></button>
                </div>
            </div>

        </el-container>

    </div>
</template>

<script>
import MyHeader from "@/components/MyHeader";
export default {
    name: "Music",
    components:{MyHeader},
    created() {
        this.getMusic();
    },
    methods:{
        //获取音乐
        getMusic(){
            //获取音乐列表
            this.$http.get("music/music/list").then(
                resp => {
                    this.music = resp.data.data.list;
                    for(let i = 0;i < this.music.length;i++){
                        this.music.at(i).durationStr = this.translateDuration(this.music.at(i).duration);
                        this.music.at(i).lrc = this.processLrc(this.music.at(i).lrc);
                    }
                },
            )

        },
        //切换音乐
        selectMusic(item){
            if(item !== null){
                this.$http.get("music/music/" + item.mid).then(
                    resp => {
                        this.current_lrc = {}
                        this.current_music = resp.data.data.music;
                        this.current_music.durationStr = this.translateDuration(this.current_music.duration);
                        this.$refs.audio.src = this.current_music.path;
                        //更新状态
                        this.playing = true;
                        this.current_time = 0;
                        this.$refs.audio.play();
                        this.current_music.lrc = this.processLrc(this.current_music.lrc);

                        if(this.playing === true){
                            //开启计时器
                            clearInterval(this.timer)  //函数开始时，对定时器的清除,避免同时多个定时器的存在
                            this.timer = setInterval(() => {
                                if(this.$refs.audio.currentTime >= this.current_music.duration){
                                    //歌曲播放完毕
                                    this.nextMusic();     //下一首音乐
                                }
                                if(this.current_music.lrc != undefined)this.uploadLrc();   //更新歌词
                                this.current_time = this.$refs.audio.currentTime;
                            }, 1000)
                        }

            },
                )
            }
        },
        //上一首音乐
        prevMusic(){
            for(let i = 0;i < this.music.length;i++){
                if(this.music.at(i).mid === this.current_music.mid){
                    if(i === 0){
                        this.selectMusic(this.music.at(this.music.length - 1));
                    }else{
                        this.selectMusic(this.music.at(i - 1));
                    }
                    break;
                }
            }
        },
        //播放音乐
        playMusic(){
            if(this.playing){
                this.$refs.audio.pause();
            }
            else{
                if(JSON.stringify(this.current_music) === "{}"){
                    //当前没有正在播放的音乐
                    this.getMusic();
                    this.selectMusic(this.music.at(0))
                }else{
                    this.$refs.audio.play();
                }

            }
            this.playing = !this.playing;
        },
        //下一首音乐
        nextMusic(){
            for(let i = 0;i < this.music.length;i++){
                if(this.music.at(i).mid === this.current_music.mid){
                    if(i === this.music.length - 1){
                        this.selectMusic(this.music.at(0));
                    }else{
                        this.selectMusic(this.music.at(i + 1));
                    }
                    break;
                }
            }
        },
        //转换时间单位
        translateDuration(duration){
            let minutes = Math.floor(duration / 60);    //分钟
            let seconds = duration - minutes * 60;
            let str = "";
            if(minutes < 10)str += ("0" + minutes);
            else str += minutes;
            str += ":";
            if(seconds < 10)str += ("0" + seconds);
            else str += seconds;
            return str;
        },

        //歌词处理
        processLrc(lrcStr){
            //返回当前应该显示的行
            if(lrcStr !== null){
                let ans = [];
                let arr = lrcStr.split("\n");
                for(let i = 0;i < arr.length;i++){
                    let line = arr.at(i);
                    let start = line.indexOf('[')
                    let end = line.indexOf(']');
                    let time = line.slice(start + 1,end);      //截取时间

                    //转化00:00:000格式为秒值
                    let sp = time.indexOf(':');
                    let minutes = parseInt(time.slice(0,sp));
                    let second = parseFloat(time.slice(sp + 1,time.length));

                    //提取歌词内容
                    let lrc_content = line.slice(end + 1,line.length);
                    let temp = {
                        duration:minutes * 60 + second,
                        content:lrc_content
                    };
                    ans.push(temp)
                }
                return ans;
            }
        },
        //刷新歌词
        uploadLrc(){
            let current = this.$refs.audio.currentTime;   //当前时间
            //寻找应该显示哪一句歌词
            let i = 0;
            for(i = 0;i < this.current_music.lrc.length;i++){
                if(current < this.current_music.lrc.at(i).duration){
                    i -= 1;
                    break;
                }else if(current === this.current_music.lrc.at(i).duration){
                    break;
                }
            }

            this.current_lrc.prev1 = i > 1 ? this.current_music.lrc.at(i - 2).content : "";
            this.current_lrc.prev2 = i > 0 ? this.current_music.lrc.at(i - 1).content : "";
            this.current_lrc.current = this.current_music.lrc.at(i).content;
            this.current_lrc.next1 = i < this.current_music.lrc.length - 1 ? this.current_music.lrc.at(i + 1).content : "";
            this.current_lrc.next2 = i < this.current_music.lrc.length - 2 ? this.current_music.lrc.at(i + 2).content : "";
        }
    },
    data(){
        return {
            timer:{},       //计时器对象
            playing:false,          //播放状态
            lrc:[],
            current_lrc:{
                prev1:"",
                prev2:"",
                current:"",
                next1:"",
                next2:""
            },
            music:[],               //音乐列表
            current_music:{durationStr:"00:00"},
            current_time:0
        }
    }
}
</script>

<style scoped>
.not_current{
    margin-bottom: 10px;
}
.current_lrc{
    color: red;
    filter: brightness(120%);
    margin-bottom: 10px;
    background-color: rgba(0,0,0,0.2);
    font-size: 27px;
}
.music_lyric{
    letter-spacing: 12px;
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 250px;
    color: white;
    font-size: 23px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}
.playing_icon{
    height: 40px;
    width: 40px;
    border-radius: 50%;
}
.volume{
    height: 100%;
    width: 28%;
    border: none;
    background-image: url("../../public/images/volumeMiddle.png");
    background-position: center;
    background-size: 30%;
    background-repeat: no-repeat;
    background-color: rgba(0,0,0,0);

}
.other_control{
    width: 25%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.title{
    display: flex;
    margin-bottom: 25px;
    width: 100%;
    height: 20px;
    text-align: left;
    font-size: 23px;
    align-items: center;
    justify-content: space-between;
}
.progress_bar{
    width: 50%;
    margin-top: 20px;
}
.bar{
    width: 100%;
    height: 20px;
}
.music_surface{
    margin-top: 15px;
    height: 50%;
    width: 100%;
    display: flex;
    justify-content: center;
}
.music_logo{
    height: 100%;
    width: 50%;
    border-radius: 50%;
    box-shadow: 1px 1px 1px 1px rgba(122, 197, 97, 0.24);
}
.play_control{
    height: 80%;
    width: 25%;
}
.next_button:hover{
    cursor: pointer;
    background-color: rgba(255,255,255,0.5);
    transition-duration: 0.1s;
}
.pause_button:hover{
    cursor: pointer;
    background-color: rgba(255,255,255,0.5);
    transition-duration: 0.1s;
}
.play_button:hover{
    cursor: pointer;
    background-color: red;
    background-color: rgba(255,255,255,0.5);
    transition-duration: 0.1s;
}
.prev_button.control_button{
    background-image: url("../../public/images/prev.png");
}
.next_button.control_button{
    background-image: url("../../public/images/next.png");
}
.repeat.control_button{
    background-image: url("../../public/images/repeat.png");
}
.volume.control_button{
    background-image: url("../../public/images/volumeMiddle.png");
}
.control_button:hover{
    cursor: pointer;
    background-color: red;
    background-color: rgba(255,255,255,0.5);
    transition-duration: 0.1s;
}
.control_button{
    transition-duration: 0.3s;
    height: 100%;
    width: 28%;
    border: none;
    background-position: center;
    background-size: 30%;
    background-repeat: no-repeat;
    background-color: rgba(0,0,0,0);

}
.play_button{
    transition-duration: 0.3s;
    border: none;
    height: 100%;
    width: 28%;
    background-image: url("../../public/images/play.png");
    background-position: center;
    background-size: 30%;
    background-repeat: no-repeat;
    background-color: rgba(0,0,0,0);
}
.pause_button{
    border: none;
    transition-duration: 0.3s;
    height: 100%;
    width: 28%;
    background-image: url("../../public/images/pause.png");
    background-position: center;
    background-size: 30%;
    background-repeat: no-repeat;
    background-color: rgba(0,0,0,0);
}
.el-container{
    display: flex;
    flex-direction: column;
}
.music_line:hover{
    background-color: red;
    cursor: pointer;
    background-color: rgba(0,0,0, 0.41);
    transition-duration: 0.1s;
    filter: brightness(110%);

}
.table_head{
    height: 40px;
    border: none;
    border-collapse: collapse;
}
.table_item{
    height: 50px;
    border: none;
    border-spacing: 0;
    border-collapse: collapse;
}
.music_line{
    transition-duration: 0.1s;
    height: 40px;
    font-size: 20px;
    border-spacing: 0;
    border-collapse: collapse;
    border: 1px solid rgba(0,0,0,0.41);
}
.control_div{
    height: 15%;
    width: 96.5%;
    display: flex;
    align-items: center;
    margin-left: 35px;
    margin-right: 10px;
    margin-bottom: 15px;
    border-radius: 10px;
    background-color: rgba(255,255,255, 0.61);
    box-shadow: 1px 1px 1px 1px rgba(122, 197, 97, 0.24);
}
.music_list{
    width: 100%;
    margin-top: 10px;
}
.main{
    position: relative;
    background-image: url("../../public/images/bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.box{
    padding-top: 10px;
    height: 85%;
    width: 100%;
    display: flex;
}

.music_list_div{
    height: 95%;
    width: 60%;
    color: white;
    margin-left: 40px;
    border-radius: 10px;
    background-color: rgba(0,0,0, 0.41);
    box-shadow: 1px 1px 1px 1px rgba(122, 197, 97, 0.24);
}
.music_info_div{
    height: 95%;
    border-radius: 10px;
    width: 36%;
    margin-left: 10px;
    background-color: rgba(0,0,0,0.41);
    box-shadow: 1px 1px 1px 1px rgba(122, 197, 97, 0.24);
}
.el-header{
    padding: 0;

}
</style>