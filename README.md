# usage:
1. install & register
`` npm install t-vue-form-preview ``

```
  import FormDesigner from 't-vue-form-preview'
    ...
 components: {FormDesigner,}
```
2. in .vue file
```
  <FormDesigner ref="FD"
                    :view="!edit"
                    :id="formId"
                    :userId="userId"
                    :rules="formRules"
                    :formModel="formModel"
                    :fdFormItems="fdFormItems"
                    :fdFormData="fdFormData"
      ></FormDesigner>

```
