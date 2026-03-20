<template>
  <el-dialog
    v-model="state.showDialog"
    title="用户组别权限"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="my-dialog-form"
  >
    <MyTable ref="userGroupTable" :data="state.userGroupList" highlight-current-row :show-paging="false" :show-toolbox="false">
      <template #headerButton>
        <div style="display: flex; flex-direction: row">
          <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </div>
      </template>
      <el-table-column label="用户" prop="name"></el-table-column>
      <el-table-column label="分组名称" prop="groupName"></el-table-column>
      <el-table-column label="检验" prop="canTest">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canTest"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="初审" prop="canFirstCheck">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canFirstCheck"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="复审" prop="canSecondCheck">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canSecondCheck"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="反审" prop="canUnCheck">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canUnCheck"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="打印后反审" prop="canPrintedUnCheck">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canPrintedUnCheck"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="取检" prop="canCancelTest">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canCancelTest"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="反取检" prop="canDisCancel">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canDisCancel"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column label="修改信息" prop="canModifiedInfo">
        <template #default="{ row }">
          <el-checkbox
            v-model="(row as BaseUserGroupOutput).canModifiedInfo"
            label=""
            :true-value="1"
            :false-value="0"
            @change="(row as BaseUserGroupOutput).isChange = true"
          />
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="selectAll(row)">全选</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <el-dialog v-model="state.selectGroupDialogShow" destroy-on-close title="选择组别">
      <MySelectTable ref="mySelectTableRef" :data="state.groupList" :mutil-select="true" style="width: 100%">
        <el-table-column prop="groupCode" label="组别名称" show-overflow-tooltip resizable />
        <el-table-column prop="groupName" label="组别代码" show-overflow-tooltip resizable />
      </MySelectTable>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onCancelGroup">取消</el-button>
          <el-button type="primary" @click="confirmGroup">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import { BaseUserGroupOutput } from '/@/api/lims/basedata/datacontract/usergroup-datacontract'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { BaseUserGroupApi } from '/@/api/lims/basedata/baseusergroup'
import MySelectTable from '/@/components/my-select-table/index.vue'
import { UserGetPageOutput } from '/@/api/admin/data-contracts'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'

const mySelectTableRef = ref()

const perms = {
  add: 'api:lims:base-user-group:add',
  update: 'api:lims:base-user-group:update',
  delete: 'api:lims:base-user-group:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  groupList: [] as BaseGroupOutput[],
  userGroupList: [] as BaseUserGroupOutput[],
  selectGroupDialogShow: false,
  showDialog: false,
  currUser: {} as UserGetPageOutput,
})

onMounted(async () => {
  await new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
})
const onAdd = () => {
  state.selectGroupDialogShow = true
}

const confirmGroup = () => {
  var selectList = mySelectTableRef.value.getSelectionRows()
  if (selectList.length > 0) {
    let addList = [] as BaseUserGroupOutput[]
    selectList.forEach((g: BaseGroupOutput) => {
      if (state.userGroupList.findIndex((v) => v.groupCode == g.groupCode) < 0) {
        let obj = {
          userId: state.currUser.id,
          name: state.currUser.name,
          groupCode: g.groupCode,
          groupName: g.groupName,
          canTest: 0,
          canFirstCheck: 0,
          canSecondCheck: 0,
          canUnCheck: 0,
          canPrintedUnCheck: 0,
          canCancelTest: 0,
          canDisCancel: 0,
          canModifiedInfo: 0,
          isValid: true,
        } as BaseUserGroupOutput
        addList.push(obj)
      }
    })
    new BaseUserGroupApi().addList(addList).then((res) => {
      if (res?.success) {
        state.selectGroupDialogShow = false
        refreshData()
      }
    })
  }
}
const selectAll = (row: BaseUserGroupOutput) => {
  row.canTest = 1
  row.canFirstCheck = 1
  row.canSecondCheck = 1
  row.canUnCheck = 1
  row.canPrintedUnCheck = 1
  row.canCancelTest = 1
  row.canDisCancel = 1
  row.canModifiedInfo = 1
  row.isChange = true
}
const onDelete = (row: BaseUserGroupOutput) => {
  modal
    .confirmDelete(`确定要删除当前行吗？`, undefined)
    .then(async () => {
      await new BaseUserGroupApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true }).then((res) => {
        refreshData()
      })
    })
    .catch(() => {})
}

const open = (user: UserGetPageOutput) => {
  state.currUser = user
  refreshData()
  state.showDialog = true
}
const refreshData = () => {
  new BaseUserGroupApi().getListByUserId({ userId: state.currUser.id }, { loading: true, showErrorMessage: true }).then((res) => {
    state.userGroupList = res.data ?? []
  })
}
const onCancelGroup = () => {
  state.selectGroupDialogShow = false
}
const onCancel = () => {
  state.userGroupList = []
  state.currUser = {}
  state.showDialog = false
}
const confirm = () => {
  new BaseUserGroupApi()
    .updateList(state.userGroupList, { loading: true, showSuccessMessage: true })
    .then(() => {
      state.showDialog = false
    })
    .catch(() => {})
}
defineExpose({
  open,
})
</script>

<style scoped lang="scss"></style>
