<template>
  <div id="outside">
    <div id="top">
        <span id="bookname">{{ this.$route.params.bookId }}</span>
        <span id="submitbtn">
            <v-btn x-large color="primary">제출하기</v-btn>
        </span>
    </div>

    <hr />
    <div id="mindmap">
      <!--d3-network :net-nodes="nodes" :net-links="links" :options="options" /-->
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
      }
    };
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

<style>
#outside {
  width: 100%;
  height: 100%;
}
#top {
  width: 100%;
}
#submitbtn {
  text-align: right;
}
#mindmap {
  border: 4px solid blue;
  width: 90%;
  height: 80%;
  margin-left: 5%;
  margin-top: 5%;
}
#bookname {
  font-size: 40px;
  vertical-align: middle;
}

#mindmap > .net {
  width: 100%;
  height: 100%;
}
</style>