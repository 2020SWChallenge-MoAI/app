<template>
  <div class="right-menu-items">
    <right-menu-button
      text="AI도우미"
      id="aiHelp"
      :image="require('@/assets/img/layouts/base/right/ai-assistant.svg')"
    />
    <right-menu-button
      text="생각펼치기"
      url="/activity/mindmap"
      :image="require('@/assets/img/layouts/base/right/mindmap.svg')"
    />
    <right-menu-button
      text="그림설명"
      url="/activity/writing"
      :image="require('@/assets/img/layouts/base/right/writing.svg')"
    />
    <right-menu-button
      text="그림그리기"
      url="/activity/drawing"
      :image="require('@/assets/img/layouts/base/right/drawing.svg')"
    />
    <right-menu-button
      text="독서퀴즈"
      url="/activity/quiz-game"
      :image="require('@/assets/img/layouts/base/right/quiz-game.svg')"
    />
    <right-menu-button
      text="마이페이지"
      url="/mypage"
      :image="require('@/assets/img/layouts/base/right/mypage.svg')"
    />
  </div>
</template>

<style scoped>
  .right-menu-items {
    display: flex;
    flex-flow: column;
  }

  .right-menu-items > *:not(:last-child) {
    margin-bottom: 1vh;
  }
</style>
