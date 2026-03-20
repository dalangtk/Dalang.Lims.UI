<template>
  <div style="margin: 80px 0 0 10px">
    <conditionGroup
      :floor="floor"
      :conditionList="conditionList"
      :parentData="this"
      :key-list="keyOptions"
      :condition-map="conditionOptions"
      :val-list="valueOptions"
    >
    </conditionGroup>

    <el-button type="primary" @click="query">查询</el-button>
  </div>
</template>

<script>
import conditionGroup from './components/conditionGroup.vue'

const condition = {
  id: 1,
  index: 1,
  condition: '',
  operate: 'and',
  field: '',
  value: '',
  header: true,
  checked: false,
  pid: -1,
  floor: 1,
}

export default {
  name: 'demo',
  components: {
    conditionGroup,
  },
  data() {
    return {
      conditionList: [Object.assign({}, condition)],
      floor: 1,

      keyOptions: [
        { key: '字段1', val: 'field1' },
        { key: '字段2', val: 'field2' },
        { key: '字段3', val: 'field3' },
        { key: '字段4', val: 'field4' },
      ],
      conditionOptions: {
        field2: [{ key: '=', val: 'eq' }],
        field3: [
          { key: '=', val: 'eq' },
          { key: '>', val: 'gt' },
        ],
      },
      valueOptions: {
        field2: {
          dom: 'select',
          data: [
            { key: '值1', val: 'val1' },
            { key: '值2', val: 'val2' },
          ],
        },
        field3: {
          dom: 'select',
          data: [
            { key: '值3', val: 'val3' },
            { key: '值4', val: 'val4' },
          ],
        },
        field4: {
          dom: 'date',
        },
      },
    }
  },
  created() {},
  methods: {
    query() {
      console.log(this.conditionList)
    },
  },
}
</script>

<style scoped></style>
