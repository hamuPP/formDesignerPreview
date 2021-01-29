## usage:
###1. install
`` npm install t-vue-form-preview ``

```

    ...
 components: {FormDesigner,}
```

###2. register component
####(1).in main.js
```
  import 't-vue-form-preview/dist/index.css'
  import FormDesigner from 't-vue-form-preview'
   
  .....
  Vue.component('FormDesigner', FormDesigner);

```
    
####(2).in .vue file
```
  import 't-vue-form-preview/dist/index.css'
  import FormDesigner from 't-vue-form-preview'
   
  .....
  components: {FormDesigner}

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
