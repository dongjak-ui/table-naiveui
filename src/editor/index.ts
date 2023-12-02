import {
    ColumnEditorValidationRuleType,
    ICarBrandSelect,
    IColumnEditor,
    IColumnEditorValidationRule, INumberEditor, ITextAreaEditor,
    ITextEditor
} from "@dongjak-public-types/table";
import {FormItemRule, NInput, NInputNumber} from "naive-ui";
import CarBrandSelector from "./CarBrandSelector.vue";
import AdministrativeAreaEditor from "./AdministrativeAreaEditor.vue";
import ImageEditor from "./ImageEditor.vue";
import Selector from "./Selector.vue";
import DateEditor from "./DateEditor.vue";

export const useEditors = (props: { editors: IColumnEditor[] }) => {
    const createEditor = (editor: IColumnEditor): IColumnEditor => {
        switch (editor.type) {
            case "text":
                const textEditor = editor as ITextEditor
                return {
                    ...textEditor,

                    component: h(NInput, {
                        clearable: true,
                        placeholder: textEditor.placeholder
                    })
                }
            case "text_area":
                const textAreaEditor = editor as ITextAreaEditor
                return {
                    ...textAreaEditor,

                    component: h(NInput, {
                        clearable: true,
                        type:"textarea",
                        placeholder: textAreaEditor.placeholder
                    })
                }
            case 'car_brand_select':
                return {
                    ...editor,
                    //@ts-ignore
                    component: h(CarBrandSelector, {
                        editor
                    })
                }
            case 'number':
                const numberEditor = editor as INumberEditor
                return {
                    ...editor,
                    component: h(NInputNumber, {
                        class: 'w-full',
                        clearable: true,
                        placeholder: numberEditor.placeholder,
                        min: numberEditor.min,
                        max: numberEditor.max,
                    })
                }
            case 'area':
                return {
                    ...editor,
                    //@ts-ignore
                    component: h(AdministrativeAreaEditor, {
                        editor
                    })
                }
            case 'image':
                return {
                    ...editor,
                    //@ts-ignore
                    component: h(ImageEditor, {
                        editor
                    })
                }
            case 'select':
                return {
                    ...editor,
                    //@ts-ignore
                    component: h(Selector, {
                        editor
                    })
                }
            case 'date':
                return {
                    ...editor,
                    //@ts-ignore
                    component: h(DateEditor, {
                        editor
                    })
                }
            case 'hidden':

                return  {
                    ...editor,
                    component: h("input", {
                       type:"hidden",
                        value:editor.value,
                        name:editor.field
                    })
                }
        }


        throw new Error(`不支持的编辑器类型：${editor.type}`)


    }

    const createRule = (editor: IColumnEditor): FormItemRule | FormItemRule [] => {

        const parseRule = (rule: IColumnEditorValidationRule | ColumnEditorValidationRuleType | ((value: any) => boolean)): FormItemRule => {
            if (typeof rule === "string") {
                switch (rule) {
                    case "required":
                        return {
                            required: true,
                            message: `${editor.label}不能为空`,
                            trigger: ['blur']
                        } as FormItemRule
                }
            } else if (typeof rule === "function") {
                return {
                    required: true,
                    validator(rule2: FormItemRule, value: string) {

                        return rule(value)
                    },
                    trigger: ['blur'],
                    message: `${editor.label}不能为空`
                } as FormItemRule
            } else {
                return {
                    required: rule.required,
                    validator(rule2: FormItemRule, value: string) {

                        return rule.validator(value, rule2)
                    },
                    trigger: ['blur'],
                    message: rule.message
                } as FormItemRule
            }

        }


        return editor.rules?.map(rule => {
            return parseRule(rule)
        }) ?? []
    }
    const formValue = ref({} as Record<string, any>)
    const editors = computed(() => {
        const _editors = props.editors.map(createEditor)
        formValue.value=_editors.reduce((acc: any, cur: IColumnEditor) => {
            acc[cur.field!] = cur.value ?? null
            return acc
        }, {})
        return _editors
    })

    const rules = computed(() => {
        const rule: Record<string, FormItemRule | FormItemRule[]> = {}
        editors.value.reduce((prev, curr: IColumnEditor) => {
            const rule = createRule(curr)
            if (rule)
                prev[curr.field!] = rule
            return prev
        }, rule)
        return rule
    })

    return {
        editors,
        formValue,
        rules
    }
}
