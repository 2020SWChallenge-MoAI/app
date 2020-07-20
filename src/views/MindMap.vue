<template>
  <div id="outside">
    <div id="top">
      <span id="bookname">{{ this.$route.params.bookId }}</span>

      <span id="submitbtn">
        <v-btn class="ma-2" x-large color="primary">제출하기</v-btn>
      </span>
    </div>

    <hr />
    <div id="mindmap">
      <!--d3-network :net-nodes="nodes" :net-links="links" :options="options" /-->
      <mindmap :mindmapData="mindmapData" />
    </div>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network';
import Mindmap from "../components/Mindmap";

export default {
    data: function() {
        return {
            nodes: [
                {id: 1, name: "Node 1"},
                {id: 2, name: "Node 2"},
                {id: 3, name: "Node 3"},
                {id: 4, name: "Node 4"},
            ],
            links: [
                {id: 1, sid: 1, tid: 2, _color: "black"},
                {id: 1, sid: 1, tid: 3, _color: "black"},
                {id: 1, sid: 1, tid: 4, _color: "black"},
            ],
            options: {
                force: 10000,
                nodeSize: 10,
                linkWidth: 2
            },
            mindmapData:
            {
                text: "Level 1",
                children: [
                    {
                        text: "Level 2-1",
                        children: [
                            {
                                text: "Level 3-1",
                                children: []
                            },
                            {
                                text: "Level 3-2",
                                children: []
                            },
                        ]
                    },
                    {
                        text: "Level 2-2",
                        children: [
                            {
                                text: "Level 3-3",
                                children: []
                            },
                            {
                                text: "Level 3-4",
                                children: []
                            },
                        ]
                    },
                    {
                        text: "Level 2-3",
                        children: []
                    }

                ]
            }
        }
    },
    components: {
        D3Network,
        Mindmap
    }
}
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