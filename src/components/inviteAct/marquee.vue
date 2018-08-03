<template>
　　<div class="content">
　　　　<ul>
　　　　　　<div id="scrollBox">
　　　　　　　　<div class="scrollWrap">
　　　　　　　　　　<div id="scrollContOne" class="scrollCont">
　　　　　　　　　　　　<li v-for="item in listData">
　　　　　　　　　　　　　　{{item}}
　　　　　　　　　　　　</li>
　　　　　　　　　　</div>
　　　　　　　　　　<div id="scrollContTwo" class="scrollCont"></div>
　　　　　　　　</div>
　　　　　　</div>
　　　　</ul>
　　</div>
</template>
<script type="text/ecmascript-6">
    export default {
    　　data () {
            return {
    　　　　    canScrollTimer: 0
            };
    　　 },
        props: {
            'listData': {
                type: [Array],
                default: []
            }
        },
        methods: {
    　　　　run() {
    　　　　　　let speed = 40;
    　　　　　　let scrollBox = document.getElementById("scrollBox");
    　　　　　　let scrollContOne = document.getElementById("scrollContOne");
    　　　　　　let scrollContTwo = document.getElementById("scrollContTwo");
    　　　　　　scrollContTwo.innerHTML = scrollContOne.innerHTML;
    　　　　　　scrollBox.scrollLeft = 0;
    　　　　　　function scrollRadio() {
    　　　　　　　　if (scrollBox.scrollLeft >= scrollContTwo.offsetWidth) {
    　　　　　　　　　　scrollBox.scrollLeft -= scrollContOne.offsetWidth
    　　　　　　　　} else {
    　　　　　　　　　　scrollBox.scrollLeft += 2;
    　　　　　　　　}
    　　　　　　}
    　　　　　　let MyScrollRadio = setInterval(scrollRadio, speed);
    　　　　　　scrollBox.onmouseover = function() {
    　　　　　　　　clearInterval(MyScrollRadio)
    　　　　　　};
    　　　　　　scrollBox.onmouseout = function() {
    　　　　　　　　MyScrollRadio = setInterval(scrollRadio, speed)
    　　　　　　};
    　　　　},
    　　　　canScroll() {
    　　　　　　let innerHTML = document.getElementById("scrollContOne").innerHTML;
    　　　　　　if (innerHTML != null && innerHTML != '' && innerHTML.trim().length != 0) {
    　　　　　　　　clearInterval(this.canScrollTimer);
    　　　　　　　　this.run();
    　　　　　　} else {
    　　　　　　　　let self = this;
    　　　　　　　　this.canScrollTimer = setInterval(function() {
    　　　　　　　　　　self.canScroll()
    　　　　　　　　}, 1000);
    　　　　　　}
    　　　　}
    　　},
    　　mounted() {
    　　　　this.canScroll();
            console.log(this.listData)
    　　}
    }
</script>
<style type="text/stylus" lang="stylus" scoped>

　　.content 
        height 60px
        overflow hidden
        ul 
            white-space nowrap
            li 
            position relative
            font-size 14px
            vertical-align middle
            line-height 35px
            padding 0 8px
            white-space nowrap
            display inline-block
            a 
                text-decoration none
                color #fff
#scrollBox 
    overflow hidden
    margin-left 36px
    .scrollWrap 
        width 500%
.scrollCont 
    float left


</style>

