<template>
  <div class="result">
    <div class="result-header">
      <v-icon
        x-large
        @click="$emit('prev')"
      >
        mdi-menu-left
      </v-icon>

      <div
        class="result-title"
        transition="slide-x-transition"
      >
        {{ month }}월 마인드맵 평가
      </div>

      <v-icon
        x-large
        @click="$emit('next')"
      >
        mdi-menu-right
      </v-icon>
    </div>

    <transition
      name="slide"
      mode="out-in"
    >
      <table
        class="result-content"
        style="background: lightblue;"
      >
        <thead>
          <tr>
            <th />
            <th>1주</th>
            <th>2주</th>
            <th>3주</th>
            <th>4주</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>이해도</td>
            <td>10</td>
            <td>21</td>
            <td>10</td>
            <td>21</td>
          </tr>

          <tr>
            <td>성실성</td>
            <td>10</td>
            <td>21</td>
            <td>10</td>
            <td>21</td>
          </tr>

          <tr>
            <td style="border-radius: 0 0 0 2vw;">
              창의성
            </td>
            <td>10</td>
            <td>21</td>
            <td>10</td>
            <td style="border-radius: 0 0 2vw 0;">
              21
            </td>
          </tr>
        </tbody>
      </table>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['month'],
};
</script>

<style lang="scss" scoped>
.result {
  width: 50vw;
  height: 39vh;
  border-radius: 3vw;
  background: lightblue;
}

.result-header {
  width: 48vw;
  margin-left: 1vw;
  margin-top: 2vh;
}

.result-title {
  width: 40vw;
  height: 4vh;
  text-align: center;
  font-size: 2.5vw;
  display: inline-block;
}

.result-content {
  width: 48vw;
  height: 26vh;
  margin-left: 1vw;
  margin-top: 3vh;
  text-align: center;

  th {
    background: lightcyan;
    font-size: 2.2vw;
  }
  td {
    background: #fffdf2;
    font-size: 2.2vw;
  }
}
</style>
