<script setup lang="ts">
import { ref } from "vue";
import Draggable from "vuedraggable";
import type { UploadProps } from "element-plus";
import { CloseBold } from "@element-plus/icons-vue";

interface FileListItem {
  name: string;
  url: any;
}

const fileList = ref<FileListItem[]>([]);

const handleChange: UploadProps["onChange"] = (uploadFile) => {
  // @ts-ignore
  const fileUrl = URL.createObjectURL(uploadFile.raw);
  fileList.value.push({
    name: uploadFile.name,
    url: fileUrl,
  });
};

const handleRemove: UploadProps["onRemove"] = (uploadFile) => {
  fileList.value = fileList.value.filter((i) => i.name !== uploadFile.name);
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

<template>
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
      <img class="upload-content-image" src="../assets/folder.png" alt="" />
      <div class="el-upload__text">点击选择或<em>拖动图片到此处</em>批量上传图片</div>
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
</template>

<style scoped>
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
}

.file-item-right:hover {
  opacity: 0.6;
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
</style>
