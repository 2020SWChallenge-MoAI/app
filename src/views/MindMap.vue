<template>
  <div id="outside">
    <div id="top">
        <span id="bookname">{{ this.$route.params.bookTitle }}</span>
        <v-btn id="submitbtn" x-large color="primary">제출하기</v-btn>
    </div>

    <hr />
    <div id="mindmap">
      <mindmap :mindmapData="mindmapData" @mindmapDataUpdated="mindmapDataUpdated"/>
    </div>
  </div>
</template>

<script>
import D3Network from "vue-d3-network";
import Mindmap from "../components/Mindmap";

export default {
  data: function() {
    return {
      /*
      mindmapData: {
        id: 0,
        text: "[0] 0",
        children: [
          {
            id: 1,
            text: "[1] 0-1",
            children: [
              {
                id: 2,
                text: "[2] 0-1-2",
                children: []
              },
              {
                id: 3,
                text: "[3] 0-1-3",
                children: []
              }
            ]
          },
          {
            id: 4,
            text: "[4] 0-4",
            children: [
              {
                id: 5,
                text: "[5] 0-4-5",
                children: []
              },
              {
                id: 6,
                text: "[6] 0-4-6",
                children: [
                  {
                    id: 7,
                    text: "[7] 0-4-6-7",
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 8,
            text: "[8] 0-8",
            children: []
          }
        ]
      }*/
      mindmapData: {
        id: 0,
        text: this.$route.params.bookTitle,
      }
    };
  },
  mounted() {
    console.log(this.$route.params.bookId, this.$route.params.bookTitle)
  },
  components: {
    D3Network,
    Mindmap
  },
  methods: {
    mindmapDataUpdated(mindmapData) {
      this.mindmapData = mindmapData;
    }
  }
};
</script>

<style scoped>
#outside {
  width: 100%;
  height: calc(100% - 63px);
}
#top {
  width: 100%;
  height: 55px;
  display: inline-flex;
  justify-content: space-between;
}
#submitbtn {
  text-align: right;
  height: 100%;
  margin-right: 1%;
}
#mindmap {
  border: 4px solid blue;
  width: 100%;
  height: 100%;
}
#bookname {
  font-size: 40px;
  vertical-align: middle;
  height: 100%;
  flex: left;
  margin-left: 3%;
}
#mindmap > .net {
  width: 100%;
  height: 100%;
}
</style>