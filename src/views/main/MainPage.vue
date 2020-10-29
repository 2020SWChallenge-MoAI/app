<template>
  <div id="main">
    <div id="background-forest" />

    <div id="first">
      <div id="btn-back" >
        <div id="btn-back-img" />
        <span id="btn-back-string" >뒤로가기</span>
      </div>
    </div>

    <div id="second">
      <div id="top-bar">

        <div id="tab-o">
          <div id="tab-i">
            전래동화
          </div>
        </div>

        <div id="tab-o">
          <div id="tab-i">
            과학/환경
          </div>
        </div>

        <div id="tab-o">
          <div id="tab-i">
            문화/예술
          </div>
        </div>

        <div id="tab-o">
          <div id="tab-i">
            동요/동시
          </div>
        </div>

        <div id="tab-o">
          <div id="tab-i">
            학습일반
          </div>
        </div>

      </div>

      <div id="center-box">
        <div id="bookshelf-1" />
        <div id="bookshelf-2" />

        <div id="page-location">
          <div id="page-location-circle-selected" >
            <div id="page-location-circle" />
          </div>

          <div id="page-location-circle" />

          <div id="page-location-circle" />
        </div>
      </div>
    </div>

    <div id="third">
      <div id="menu-text">
        MENU
      </div>
      <div id="right-menu">
        <div id="menu-ai" />
        <div id="menu-mindmap" />
        <div id="menu-activity" />
        <div id="menu-quiz" />
        <div id="menu-filtering" />
        <div id="menu-mypage" />
      </div>
    </div>
  </div>
</template>

<script>

export default {

};
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #A6D6CD 0%, rgba(166, 214, 205, 0) 100%);
}

#first {
  width: 10%;
  height: 100%;
  display: inline-block;
}

#second {
  width: 80%;
  height: 100%;
  display: inline-block;
}

#third {
  width: 10%;
  height: 100%;
  display: inline-block;
}

#background-forest {
  background-image: url('../../assets/background-forest.svg');
  background-size: cover;
  width: 100%;
  height: 50%;
  position: absolute;
  top: 50%;
  z-index: 1;
}

#center-box {
  position: relative;
  width: 100%;
  height: 80%;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 20px;
  z-index: 10;
  margin-top: 10%;
}

#btn-back {
  position: relative;
  width: 6vw;
  height: 6vw;
  background: rgba(107, 152, 159, 0.6);
  border-radius: 15px;
  margin-left: 20%;
  margin-top: 40%;
}
#btn-back-img {
  position: relative;
  width: 5.5vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-back.svg');
  background-size: cover;
}
#btn-back-string {
  position: absolute;
  width: 5vw;
  height: 3vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: normal;
  font-size: 0.5em;
  line-height: 12px;

  text-align: center;
  letter-spacing: 0.1em;

  text-align: center;
  margin-left: 0.5vw;

  color: #FFFFFF;
}

#top-bar {
  position: absolute;
  margin-top: calc(8% - 3.5vw);
  margin-left: 2%;
}

#tab-o {
  width: 12vw;
  height: 3vw;
  background: #83B1B1;
  border-radius: 10px;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  line-height: 20px;

  text-align: center;
  letter-spacing: 0.1em;
  color: #FFFFFF;
  display: inline-block;
  margin-left: 1vw;
}
#tab-i {
  margin-top: 1vw;
  width: 12vw;
  height: 2.5vw;
  background: #83B1B1;
}
#tab-s {
  width: 12vw;
  height: 3vw;
  background: #668D8D;
  border-radius: 10px;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  line-height: 20px;

  text-align: center;
  letter-spacing: 0.1em;
  color: #FFFFFF;
  display: inline-block;
  margin-left: 1vw;
}

#bookshelf-1 {
  position: absolute;
  width: 100%;
  height: 40px;
  background: rgba(156, 138, 108, 0.8);
  margin-top: 30%;
}

#bookshelf-2 {
  position: absolute;
  width: 100%;
  height: 40px;
  background: rgba(156, 138, 108, 0.8);
  margin-top: 60%;
}

#page-location {
  position: absolute;
  margin-left: 40%;
  margin-top: 68%;
}

#page-location-circle-selected {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(36, 177, 161, 0.5);
  border-radius: 50px;
}

#page-location-circle {
  width: 20px;
  height: 20px;
  background: #24B1A1;
  border-radius: 50px;
  margin-left: 10px;
  margin-top: 10px;
}

#right-menu {
  position: absolute;
  width: 8%;
  height: 75%;
  z-index: 10;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 10px;
  margin-left: 1%;
  margin-top: 12%;
}
#menu-text {
  position: absolute;
  width: 6vw;
  height: 2vw;
  margin-left: 1.8vw;
  margin-top: 9vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 2vw;
  line-height: 20px;
  /* identical to box height */

  text-align: center;

  color: #FFFFFF;
}
#menu-ai {
  position: relative;
  width: 6vw;
  height: 8vw;
  background-image: url('../../assets/right-menu/ai.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-mindmap {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/mindmap.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 3vw;
}
#menu-activity {
  position: relative;
  width: 6vw;
  height: 7.7vw;
  background-image: url('../../assets/right-menu/activity.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-quiz {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/quiz.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-filtering {
  position: relative;
  width: 6.4vw;
  height: 7.6vw;
  background-image: url('../../assets/right-menu/filtering.svg');
  background-size: cover;
  margin-left: 0.8vw;
  margin-top: 1vw;
}
#menu-mypage {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/mypage.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
</style>
