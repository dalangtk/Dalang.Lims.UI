<template>
  <el-splitter>
    <el-splitter-panel size="30%">
      <MyTable
        ref="groupTableRef"
        :data="state.groupList"
        highlight-current-row
        @current-change="groupChange"
        :show-paging="false"
        :show-toolbox="false"
      >
        <el-table-column label="分组代码" prop="groupCode"></el-table-column>
        <el-table-column label="分组名称" prop="groupName"></el-table-column>
      </MyTable>
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <MyTable ref="userGroupTable" :data="state.userGroupList" highlight-current-row :show-paging="false" :show-toolbox="false">
        <template #headerButton>
          <div style="display: flex; flex-direction: row">
            <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
              <SvgIcon name="ele-Plus" />
              新增</el-button
            >
            <el-button v-if="auth(perms.update)" type="primary" size="small" @click="save">
              <SvgIcon name="ele-Plus" />
              保存</el-button
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

      <user-select ref="userSelectRef" title="选择用户" :multiple="true" @sure="onSureUser"></user-select>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup name="/basedata/baseusergroup">
import { reactive, onMounted, ref, defineAsyncComponent } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth, auths, authAll } from '/@/utils/authFunction'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { BaseUserGroupApi } from '/@/api/lims/basedata/baseusergroup'
import { BaseUserGroupAddInput, BaseUserGroupOutput } from '/@/api/lims/basedata/datacontract/usergroup-datacontract'
import { UserGetOutput, UserGetPageOutput } from '/@/api/admin/data-contracts'
const UserSelect = defineAsyncComponent(() => import('/@/views/admin/user/components/user-select.vue'))

const groupTableRef = ref()
const userSelectRef = ref()

const perms = {
  add: 'api:lims:base-user-group:add',
  update: 'api:lims:base-user-group:update',
  delete: 'api:lims:base-user-group:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  groupList: [] as BaseGroupOutput[],
  groupCode: '',
  userGroupList: [] as BaseUserGroupOutput[],
})

onMounted(async () => {
  await new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
      if (state.groupList && state.groupList.length > 0) {
        state.groupCode = state.groupList[0].groupCode!
        groupTableRef.value.setCurrentRow(state.groupList[0])
      }
    })
    .catch((e) => {
      modal.msgError(e)
    })
})

const groupChange = (currentRow: BaseGroupOutput) => {
  state.groupCode = currentRow.groupCode!
  refreshUserGroup()
}

const refreshUserGroup = () => {
  if (!state.groupCode) return
  new BaseUserGroupApi().getListByGroupCode({ groupCode: state.groupCode }, { showErrorMessage: true }).then((res) => {
    state.userGroupList = res!.data!
  })
}

const onAdd = () => {
  userSelectRef.value!.open()
}

const save = () => {
  if (!state.userGroupList || state.userGroupList.length === 0) return

  var edited = state.userGroupList.filter((item) => item.isChange)
  if (!edited || edited.length === 0) {
    modal.msgWarning('无修改')
    return
  }

  new BaseUserGroupApi().updateList(edited).then((res) => {
    if (res?.success) {
      modal.msgSuccess('保存成功')
    }
  })
}

const addUserGroup = (users: UserGetPageOutput[]) => {
  let addList = [] as BaseUserGroupOutput[]
  for (let index = 0; index < users.length; index++) {
    const u = users[index]
    let obj = {
      userId: u.id,
      name: u.name,
      groupCode: state.groupCode,
      groupName: state.groupList.find((v) => v.groupCode == state.groupCode)?.groupName,
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
  new BaseUserGroupApi().addList(addList).then((res) => {
    if (res?.success) {
      modal.msgSuccess('新增成功')
      refreshUserGroup()
    }
  })
}
const onSureUser = async (users: UserGetPageOutput[]) => {
  userSelectRef.value.close()
  if (users == null || users.length <= 0) {
    return
  }
  addUserGroup(users)
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
      await new BaseUserGroupApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      refreshUserGroup()
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss"></style>
