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
      <v-dialog v-model="addDialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="btn add" :icon="true" :disabled="true" :block="true" v-bind="attrs" v-on="on">
            <i class="fas fa-plus-circle"></i>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">새 항목 추가하기</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field label="내용" v-model="modalAddText" required></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addDialog_Cancel()">취소</v-btn>
            <v-btn color="blue darken-1" text @click="addDialog_Apply()">적용</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="btn edit" :icon="true" :disabled="true" :block="true" v-bind="attrs" v-on="on">
            <i class="fas fa-pen"></i>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">기존 항목 수정하기</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field label="내용" v-model="modalEditText" required></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="editDialog_Cancel()">취소</v-btn>
            <v-btn color="blue darken-1" text @click="editDialog_Apply()">적용</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="btn delete" :icon="true" :disabled="true" :block="true" v-bind="attrs" v-on="on">
            <i class="fas fa-trash-alt"></i>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">삭제 확인</span>
          </v-card-title>
          <v-card-text>
            선택한 항목을 삭제하시겠습니까? 선택한 항목의 하위 항목들도 함께 삭제됩니다.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="deleteDialog_Cancel()">취소</v-btn>
            <v-btn color="blue darken-1" text @click="deleteDialog_Apply()">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
    
    <div class="debug" v-text="this.debug">
    </div>

  </div>
</template>

<script>
export default {
  name: "svg-renderer",
  props: ["mindmapData", "size", "nodes", "links", "textSize", "selected", "selectedNode"],
  data: function() {
    return {
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      modalAddText: "",
      modalEditText: "",
      debug: "null"
    };
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
      this.updateBtnActivation();
    },
    selectedNode() {
      this.updateBtnActivation();
      this.modalEditText = this.selectedNode.text;
    }
  },
  methods: {
    debugFunc() {
      return this.debug;
    },
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
    },
    updateBtnActivation() {
      if (this.selected === true) {
        var target;
        
        //add btn
        target = this.$el.querySelector(".btns .btn.add")
        target.removeAttribute("disabled");
        if(target.classList.contains("v-btn--disabled")) target.classList.remove("v-btn--disabled");

        //edit btn
        target = this.$el.querySelector(".btns .btn.edit")
        if(this.selectedNode.id != 0) { //처음 노드(최고 노드)는 편집하면 안됨(책 제목) -> 처음 노드가 선택되면 아예 버튼 활성화를 안 시킴
          target.removeAttribute("disabled");
          if(target.classList.contains("v-btn--disabled")) target.classList.remove("v-btn--disabled");
        } else {
          target.setAttribute("disabled", true);
          if(!target.classList.contains("v-btn--disabled")) target.classList.add("v-btn--disabled");
        }

        //delete btn
        target = this.$el.querySelector(".btns .btn.delete")
        if(this.selectedNode.id != 0) { //처음 노드(최고 노드)는 제거하면 안됨 -> 처음 노드가 선택되면 아예 버튼 활성화를 안 시킴
          target.removeAttribute("disabled");
          if(target.classList.contains("v-btn--disabled")) target.classList.remove("v-btn--disabled");
        } else {
          target.setAttribute("disabled", true);
          if(!target.classList.contains("v-btn--disabled")) target.classList.add("v-btn--disabled");
        }
        
        /*
        //suggestion btn
        var target = this.$el.querySelector(".btns .btn.add")
        target.removeAttribute("disabled");
        if(target.classList.contains("v-btn--disabled")) target.classList.remove("v-btn--disabled");
        */
      } else {
        this.$el.querySelectorAll(".btns .btn").forEach(function(item) {
          item.setAttribute("disabled", true);
          if(!item.classList.contains("v-btn--disabled")) item.classList.add("v-btn--disabled");
        });
      }
    },
    getSelectedNodeAncestors() {
      var ancestors = [];

      var current = this.selectedNode;
      while(true) {
        ancestors.push({
          id: current.id,
          index: current.index,
          text: current.text
        });
        
        var parentId = current.parentId;

        if(parentId === undefined) break;
        else {
          for(var node of this.nodes) {
            if(node.id === parentId) {
              current = node;
              break;
            }
          }
        }
      }

      return ancestors;
    },
    getNewMindmapNodeId() {
      var maxId = -1;
      for(var node of this.nodes) {
        if(node.id > maxId) {
          maxId = node.id;
        }
      }

      return maxId + 1;
    },
    addDialog_Cancel() {
      this.modalAddText = "";
      this.addDialog = false;
    },
    addDialog_Apply() {
      var ancestors = this.getSelectedNodeAncestors().reverse(); //최고 노드부터 나오게 역순으로 정렬
      ancestors.shift();  //처음 노드(최고 노드) 제거

      //새 노드를 위한 id 발급 : 전체 노드들의 아이디 중 최고값 + 1
      var newNodeId = this.getNewMindmapNodeId();

      //현재 노드(새 노드의 부모) 찾기
      var current = this.mindmapData;
      for (var ancestor of ancestors) {
        var id = ancestor.id;

        for(var child of current.children) {
          if(child.id === id) {
            current = child;
            break;
          }
        }
      }

      //현재 노드에 새 노드 추가하기
      current.children.push({
        id: newNodeId,
        text: this.modalAddText,
        children: []
      });

      //update
      this.$emit("mindmapDataUpdated", this.mindmapData);

      //reset
      this.modalAddText = "";
      this.addDialog = false;
    },
    editDialog_Cancel() {
      this.editDialog = false;
    },
    editDialog_Apply() {
      var ancestors = this.getSelectedNodeAncestors().reverse(); //최고 노드부터 나오게 역순으로 정렬
      ancestors.shift();  //처음 노드(최고 노드) 제거

      //현재 노드 찾기
      var current = this.mindmapData;
      for (var ancestor of ancestors) {
        var id = ancestor.id;

        for(var child of current.children) {
          if(child.id === id) {
            current = child;
            break;
          }
        }
      }

      //현재 노드 편집하기
      current.text = this.modalEditText;

      //update
      this.$emit("mindmapDataUpdated", this.mindmapData);

      //reset
      this.editDialog = false;
    },
    deleteDialog_Cancel() {
      this.deleteDialog = false;
    },
    deleteDialog_Apply() {
      var ancestors = this.getSelectedNodeAncestors().reverse(); //최고 노드부터 나오게 역순으로 정렬
      ancestors.shift();  //처음 노드(최고 노드) 제거

      //현재 노드와 부모 노드 찾기
      var current = this.mindmapData;
      var parent = undefined;
      var currentIndexInParentChildrenArr = -1;
      for (var ancestor of ancestors) {
        parent = current;
        var id = ancestor.id;

        for(var i = 0; i < current.children.length; i++) {
          var child = current.children[i];
          if(child.id === id) {
            current = child;
            currentIndexInParentChildrenArr = i;
            break;
          }
        }
      }

      if(current.id != 0) { //처음 노드(최고 노드)는 제거하면 안됨
        parent.children.splice(currentIndexInParentChildrenArr, 1);

        //update
        this.$emit("mindmapDataUpdated", this.mindmapData);
      }

      //reset
      this.deleteDialog = false;
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
}

.btns .btn {
  font-size: 40px;
}

.modal.disabled {
  display: none;
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