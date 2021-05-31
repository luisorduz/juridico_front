<template>
<div class="form-group">
  <label for="fullName">Full Name</label>
  <input type="text" class="form-control" :class="hasError('fullName') ? 'is-invalid' : ''" placeholder="Enter your name" v-model="formData.fullName">
  <div v-if="hasError('fullName')" class="invalid-feedback">
      <div class="error" v-if="!$v.formData.fullName.required">Please provide a valid name.</div>
  </div>
</div>
</template>

<script>

export default {
  props: ['formType', 'email', 'password'],
  data () {
    return {
      value: ''
    }
  }
}
</script>
