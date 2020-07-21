<template>
  <div class="mindmap">
    <svg
      :width="size.w"
      :height="size.h"
      class="net-svg"
      @mouseup='emit("dragEnd",[$event])'
      @touchend.passive='emit("dragEnd",[$event])'
      @touchstart.passive=""
    >
      <rect class="background" :width="size.w" :height="size.h" @click='emit("background")' />
      <g class="links" id="l-links">
        <path
          v-for="link in links"
          :key="link.id"
          :id="link.id"
          :class="joinClass(link.class)"
          :d="linkPath(link)"
        />
      </g>

      <g class="nodes" id="l-nodes">
        <g
          v-for="(node, key) in nodes"
          :key="key"
          :class="joinClass(node.class)"
          :id="'node-' + node.id"
          @click='emit("nodeClick",[$event,node])'
          @touchend.passive='emit("nodeClick",[$event,node])'
          @mousedown.prevent='emit("dragStart",[$event,key])'
          @touchstart.prevent='emit("dragStart",[$event,key])'
        >
          <ellipse
            :cx="node.x"
            :cy="node.y"
            :rx="node.rx"
            :ry="node.ry"
            @click='emit("nodeClick",[$event,node])'
            @touchend.passive='emit("nodeClick",[$event,node])'
            @mousedown.prevent='emit("dragStart",[$event,key])'
            @touchstart.prevent='emit("dragStart",[$event,key])'
          />
          <text
            :x="node.x"
            :y="node.y"
            text-anchor="middle"
            dominant-baseline="middle"
            :style="{fontSize: textSize + 'px'}"
            @click='emit("nodeClick",[$event,node])'
            @touchend.passive='emit("nodeClick",[$event,node])'
            @mousedown.prevent='emit("dragStart",[$event,key])'
            @touchstart.prevent='emit("dragStart",[$event,key])'
          >{{ node.text }}</text>
        </g>
      </g>
    </svg>

    <div class="btns">
      <button type="button" class="btn add" disabled>
        <i class="fas fa-plus-circle"></i>
      </button>
      <button type="button" class="btn edit" disabled>
        <i class="fas fa-pen"></i>
      </button>
      <button type="button" class="btn delete" disabled>
        <i class="fas fa-trash-alt"></i>
      </button>
      <button type="button" class="btn suggestion" disabled>
        <i class="fas fa-lightbulb"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "svg-renderer",
  props: ["size", "nodes", "links", "textSize", "selected", "selectedNode"],
  data: function() {
    return {};
  },
  updated: function() {
    this.$nextTick(function() {
      for (var node of this.nodes) {
        var bbox = this.$el
          .querySelector("#node-" + node.id + " text")
          .getBBox();
        node.rx = bbox.width / 2 + 30;
        node.ry = bbox.height / 2 + 30;
      }
    });
  },
  watch: {
    selected() {
      if (this.selected == true) {
        this.$el.querySelectorAll(".btns .btn").forEach(function(item) {
          item.removeAttribute("disabled");
        });
      } else {
        this.$el.querySelectorAll(".btns .btn").forEach(function(item) {
          item.setAttribute("disabled");
        });
      }
    }
  },
  methods: {
    joinClass(classList) {
      var arr = Array.prototype.slice.call(classList);
      return arr.join(" ");
    },
    emit(e, args) {
      this.$emit("action", e, args);
    },
    linkPath(link) {
      var d = {
        M: [link.source.x | 0, link.source.y | 0],
        X: [link.target.x | 0, link.target.y | 0]
      };

      d.Q = [link.source.x, link.target.y];

      return "M " + d.M + " Q " + d.Q.join(" ") + " " + d.X;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Gaegu&display=swap");

.mindmap {
  position: relative;
}

.btns {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
}

.btns .btn {
  color: black;
}

.btns .btn:disabled {
  opacity: 0.1;
}

.background {
  fill: transparent;
}

.node {
  cursor: grab;
}

.node:active {
  cursor: grabbing;
}

.node ellipse {
  stroke-width: 0px;
  fill: whitesmoke !important;
}

.node text {
  font-family: "Gaegu", cursive;
}

.node.selected text {
  color: red;
}

.node.depth-0 ellipse {
  stroke: red;
  fill: orange !important;
}

.node.depth-1 ellipse {
  stroke: orange;
  fill: #e88eca;
}

.node.depth-2 ellipse {
  stroke: yellow;
  fill: #cc89d1;
}

.node.depth-3 ellipse {
  stroke: green;
  fill: #dfc7eb;
}

.node.depth-4 ellipse {
  stroke: blue;
  fill: #ad87de;
}

.node.depth-5 ellipse {
  stroke: navy;
  fill: navy;
}

.node.depth-6 ellipse {
  stroke: purple;
  fill: purple;
}

.link {
  stroke-width: 5px;
  fill: transparent;
  stroke: gray;
}

.link.depth-0 {
  /*stroke: darkgray;*/
  stroke-width: 20px;
}

.link.depth-1 {
  /*stroke: orange;*/
  stroke-width: 15px;
}

.link.depth-2 {
  /*stroke: yellow;*/
  stroke-width: 10px;
}

.link.depth-3 {
  /*stroke: green;*/
  stroke-width: 5px;
}

.link.depth-4 {
  /*stroke: blue;*/
  stroke-width: 2px;
}

.link.depth-5 {
  /*stroke: navy;*/
  stroke-width: 1px;
}

.link.depth-6 {
  /*stroke: purple;*/
  stroke-width: 1px;
}
</style>