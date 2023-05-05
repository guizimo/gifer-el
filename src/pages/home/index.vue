<template>
  <div class="home-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>图片上传</span>
        </div>
      </template>
      <div>
        <el-upload
          class="upload-container"
          drag
          multiple
          :auto-upload="false"
          :show-file-list="false"
          accept=".png,.jpg"
          :on-change="handleChange"
          :on-remove="handleRemove"
        >
          <img
            class="upload-content-image"
            src="../../assets/folder.png"
            alt=""
          />
          <div class="el-upload__text">点击或<em>拖动</em>图片到此处，批量上传图片</div>
        </el-upload>
        <div class="file-title">{{ `已上传图片（${fileList.length}）` }}</div>
        <div class="file-list">
          <draggable
            :list="fileList"
            item-key="name"
            ghost-class="ghost"
            chosen-class="chosenClass"
            animation="300"
            @start="onStart"
            @end="onEnd"
          >
            <template #item="{ element }">
              <div class="file-item">
                <div class="file-item-left">
                  <img class="file-item-icon" :src="element.url" alt="" />
                  <span class="file-item-name">{{ element.name }}</span>
                </div>
                <el-icon class="file-item-right"><CloseBold /></el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>配置项</span>
          <el-button
            size="small"
            type="primary"
            :disabled="fileList.length === 0"
            @click="makeGif"
            >生成 GIF</el-button
          >
        </div>
      </template>
      <div>
        <el-form :model="optionForm" label-width="100px">
          <el-form-item label="Width">
            <el-input-number v-model="optionForm.gifWidth" />
          </el-form-item>
          <el-form-item label="Height">
            <el-input-number v-model="optionForm.gifHeight" />
          </el-form-item>
          <el-form-item label="Interval">
            <div>
              <el-input-number
                v-model="optionForm.interval"
                :precision="1"
                :step="0.1"
              />
              <div class="tip">每帧捕获之间等待的时间（以秒为单位）</div>
            </div>
          </el-form-item>
          <el-form-item label="NumFrames">
            <div>
              <el-input-number v-model="optionForm.numFrames" />
              <div class="tip">用于创建GIF的帧数</div>
            </div>
          </el-form-item>
          <el-form-item label="FrameDuration">
            <div>
              <el-input-number v-model="optionForm.frameDuration" />
              <div class="tip">每帧停留的时间（10=1s）</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>预览</span>
        </div>
      </template>
      <div>
        <div class="preload-content">
          <img :src="curSvgUrl" alt=""  class="preload-img"/>
          <el-button v-if="curSvgUrl" type="primary" @click="downloadImg">下载图片</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Draggable from "vuedraggable";
import type { UploadProps } from "element-plus";
import { CloseBold } from "@element-plus/icons-vue";
import { base64toBlob, downloadFile } from "../../utils/tools";

interface FileListItem {
  name: string;
  url: any;
}

const fileList = ref<FileListItem[]>([]);
const curSvgUrl = ref<any>("");
const optionForm = ref<any>({
  gifWidth: 300, // GIF宽度
  gifHeight: 450, // GIF高度
  images: [], // 图片列表
  interval: 1.0, // 每帧捕获之间等待的时间（以秒为单位）
  numFrames: 30, // 用于创建GIF的帧数
  frameDuration: 2, // 每帧停留的时间（10=1s）
  fontWeight: "normal", // 覆盖动画GIF的文本字体粗细
  fontSize: "16px", // 覆盖动画GIF的文本字体大小
  fontFamily: "sans-serif", // 字体类型
  fontColor: "#ffffff", // 字体颜色
  textAlign: "center", // 文本的水平对齐方式
  textBaseline: "bottom", // 文本的垂直对齐方式
  sampleInterval: 10, // 创建调色板时要跳过多少像素。默认值为10。“少”为佳，但较慢。
  numWorkers: 2, // 要使用多少个网络工作者来处理GIF动画帧。默认值为2。
});

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  // @ts-ignore
  const fileUrl = URL.createObjectURL(uploadFile.raw);
  fileList.value.push({
    name: uploadFile.name,
    url: fileUrl,
  });
};

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  fileList.value = fileList.value.filter((i) => i.name !== uploadFile.name);
};

const downloadImg = () => {
  // Vue
  const blob = base64toBlob(curSvgUrl.value)
  const myUrl = URL.createObjectURL(blob);
  downloadFile(myUrl, 'test');
};

const makeGif = () => {
  const option = {
    ...optionForm.value,
    images: fileList.value.map((i) => i.url),
  };
  // @ts-ignore
  gifshot.createGIF(option, (res: any) => {
    if (res.error) {
      return;
    }
    console.log(res);
    curSvgUrl.value = res.image;
  });
};

//拖拽开始的事件
const onStart = () => {
  console.log("开始拖拽");
};

//拖拽结束的事件
const onEnd = () => {
  console.log("结束拖拽");
};
</script>

<style scoped>
.home-container {
  display: flex;
}

.box-card {
  margin: 10px;
  min-width: 300px;
    min-height: 533px;
}

.card-header {
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.upload-container {
  width: 100%;
  min-width: 260px;
}

.upload-content-image {
  width: 40px;
  height: 40px;
}

.file-list {
  min-width: 260px;
}

.file-title {
  min-width: 260px;
  font-size: 12px;
  font-weight: bold;
  margin: 8px 0;
}

.file-item {
  margin: 8px 0;
  padding: 4px 8px;
  border-radius: 5px;
  border: solid 1px #e8e3e3;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-item:hover {
  cursor: move;
}

.file-item-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  cursor: pointer;
}

.file-item-left {
  display: flex;
  align-items: center;
}

.file-item-right {
  color: #666666;
  font-size: 12px;
  cursor: pointer;
  border-radius: 100%;
  opacity: 0.3;
}

.file-item-right:hover {
  opacity: 1;
}

.file-item-name {
  /* 设置宽度，如果文本内容长短不一，可以设置max-width最大宽度显示，小于最大宽度不会打点 */
  width: 120px;
  /* 文本不会换行显示 */
  white-space: nowrap;
  /* 超出盒子部分隐藏 */
  overflow: hidden;
  /* 文本超出的部分打点显示 */
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: bold;
  color: #666666;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  background-color: #eee;
  opacity: 1;
  border: solid 1px red;
}

.tip {
  font-size: 12px;
  color: #767272;
}

.preload-content {
    display: flex;
    flex-direction: column;
}

.preload-img {
    margin-bottom: 10px;
    width: 260px;
}
</style>
