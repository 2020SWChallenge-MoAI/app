<template>
  <div class="result-table">
    <div class="result-header">
      <v-btn
        x-large
        icon
        @click="$emit('prev')"
      >
        <v-icon>mdi-menu-left</v-icon>
      </v-btn>
      <div class="result-title">
        {{ month }}월 마인드맵 평가
      </div>
      <v-btn
        x-large
        icon
        @click="$emit('next')"
      >
        <v-icon>mdi-menu-right</v-icon>
      </v-btn>
    </div>
    <table class="result-content">
      <thead>
        <tr>
          <th />
          <th>1주</th>
          <th>2주</th>
          <th>3주</th>
          <th>4주</th>
          <th>5주</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>이해도</td>
          <td>10</td>
          <td>21</td>
          <td>10</td>
          <td>21</td>
          <td>21</td>
        </tr>
        <tr>
          <td>성실성</td>
          <td>10</td>
          <td>21</td>
          <td>10</td>
          <td>21</td>
          <td>21</td>
        </tr>
        <tr>
          <td>창의성</td>
          <td>10</td>
          <td>21</td>
          <td>10</td>
          <td>21</td>
          <td>21</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['month', 'monthlyScore'],
};
</script>

<style lang="scss" scoped>
.result-table {
  border-radius: 2vw;
  background: lightblue;
}

.result-header {
  width: 100%;
  padding: 2vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-title {
  text-align: center;
  font-size: 4vh;
  display: inline-block;
}

.result-content {
  width: 100%;
  padding: 0 1vh 1vh 1vh;
  text-align: center;

  th {
    background: lightcyan;
    font-size: 2.2vw;
  }
  td {
    background: #fffdf2;
    font-size: 2.2vw;
  }

  & > *:first-child *:first-child {
    border-top-left-radius: 2vw;
  }
  & > *:first-child *:last-child {
    border-top-right-radius: 2vw;
  }
  & > *:last-child > *:last-child *:first-child {
    border-bottom-left-radius: 2vw;
  }
  & > *:last-child > *:last-child *:last-child {
    border-bottom-right-radius: 2vw;
  }
}
</style>
