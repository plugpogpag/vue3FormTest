<template>
	<div class="flex grid-cols-2 gap-4 flex-wrap">
		<n-flex class="w-full" justify="end">
			<!-- <n-button type="info" @click="onLoad">Load</n-button> -->
			<n-button type="success" @click="onSave">Save</n-button>
			<n-button type="success" @click="submitForm">submit</n-button>
			<n-button type="success" @click="this.$refs.vueFormRef.resetValidators()">clear</n-button>
		</n-flex>
		<div style="flex: 0.6 1 0%">
			<n-card title="หน้าแสดงผล">
				<template #header-extra>
					<NButton type="success" @click="setExampleJsonData">Example Data</NButton>
				</template>
				<div class="h-[1200px] overflow-scroll pb-28">
					<Vueform
						v-bind="content.json"
						v-model="valueForm.json"
						sync
						@update:modelValue="updateData"
						ref="vueFormRef"
						:display-errors="false"
						:debounce="500"
					/>
				</div>
			</n-card>
		</div>
		<div class="gap-4 grid" style="flex: 0.4 1 0%">
			<n-card title="รายการ Form">
				<template #header-extra>
					<div class="flex gap-4 "> 
						<NButton type="success" @click="isDownloadJson = true">Export Json</NButton>
						<NButton type="success" @click="saveChangeToForm">Save Change</NButton>
					</div>
			
				</template>
				<VueJSONEditor
					:content="contentDelay"
					:onChange="onChange"
					:readOnly="readOnly"
					class="h-[300px]"
					:mode="modeEditor"
					:onChangeMode="onChangeMode"
				/>

				<n-modal v-model:show="isDownloadJson">
					<n-card
						style="width: 400px"
						title="ตั้งชื่อ File"
						:bordered="false"
						size="huge"
						role="dialog"
						aria-modal="true"
					>
						<div class="grid grid-cols-1 gap-4">
							<n-input v-model:value="nameFileJson" />
							<div class="flex justify-end items-center gap-4">
								<NButton type="primary" @click="downloadJson(content.json, nameFileJson)">
									Download
								</NButton>
								<NButton type="error" @click="isDownloadJson = false">Cancel</NButton>
							</div>
						</div>
					</n-card>
				</n-modal>
			</n-card>
			<n-card title="รายการข้อมูล Form">
				<template #header-extra>
					<NButton type="success" @click="isDownloadJson = true">Export Json</NButton>
				</template>
				<VueJSONEditor
					:content="valueForm"
					:onChange="onChangeValueForm"
					:readOnly="readOnly"
					:mode="modeEditor"
					class="h-[300px]"
					:onChangeMode="onChangeMode"
				/>

				<n-modal v-model:show="isDownloadJson">
					<n-card
						style="width: 400px"
						title="ตั้งชื่อ File"
						:bordered="false"
						size="huge"
						role="dialog"
						aria-modal="true"
					>
						<div class="grid grid-cols-1 gap-4">
							<n-input v-model:value="nameFileJson" />
							<div class="flex justify-end items-center gap-4">
								<NButton type="primary" @click="downloadJson(valueForm.json, nameFileJson)">
									Download
								</NButton>
								<NButton type="error" @click="isDownloadJson = false">Cancel</NButton>
							</div>
						</div>
					</n-card>
				</n-modal>
			</n-card>
			<n-card title="รายการ Label Form">
				<template #header-extra>
					<div class="flex gap-4 ">
						<NButton type="success" @click="isDownloadJson = true">Export Json</NButton>
						<NButton type="success" @click="saveChangeLabelForm">Save Change</NButton>
				 	</div>
				</template>
				<VueJSONEditor
					:content="LabelFormDelay"
					:onChange="onChangeLabelForm"
					:readOnly="readOnly"
					:mode="modeEditor"
					class="h-[300px]"
					:onChangeMode="onChangeMode"
				/>
			</n-card>
		</div>
	</div>
</template>

<script>
import VueJSONEditor from "./component/index.vue"
import moment from "moment"
import _, { reduce } from "lodash"
import { NCard, NButton, NModal, NInput, NFlex } from "naive-ui"
import { computed } from "vue"
import { debounce } from "lodash"
export default {
	name: "App",
	components: {
		VueJSONEditor,
		NCard,
		NButton,
		NModal,
		NInput,
		NFlex
	},
	data() {
		return {
			showEditor: true,
			readOnly: false,
			content: {
				json: {},
				text: undefined
			},
			contentDelay: {
				json: {},
				text: undefined
			},
			EXAMPLE_JSON_DATA: {
				size: "lg",
				schema: {
					text: {
						type: "text",
						label: "เวลาบันทึก :",
						columns: {
							lg: {
								container: 12
							}
						},
						disabled: true
					},
					container2: {
						type: "group",
						schema: {
							column1: {
								type: "group",
								columns: {
									container: 6
								},
								schema: {
									produce_products: {
										type: "select",
										items: [
											{
												value: 0,
												label: "Label"
											}
										],
										search: true,
										native: false,
										inputType: "search",
										autocomplete: "off",
										label: "ผลิตสินค้า",
										columns: {
											lg: {
												container: 9
											}
										}
									},
									img: {
										type: "static",
										tag: "img",
										src: "https://cdn.imweb.me/thumbnail/20210413/7b5dd5b1808ff.jpg",
										columns: {
											lg: {
												container: 2
											}
										},
										top: "1"
									}
								}
							},
							column2: {
								type: "group",
								columns: {
									container: 6
								},
								schema: {
									lot: {
										type: "text",
										label: "Lot สินค้าที่ผลิต :"
									}
								}
							},
							employee_name: {
								type: "text",
								label: "ลงชื่อพนักงาน :",
								columns: {
									lg: {
										container: 6
									}
								}
							}
						}
					},
					nestedList: {
						type: "list",
						element: {
							type: "object",
							schema: {
								container: {
									type: "group",
									schema: {
										h4: {
											type: "static",
											tag: "h4",
											content: "ตรวจสอบประสิทธิภาพ :"
										},
										p: {
											type: "static",
											tag: "p",
											content: "สถานะชั่วโมงที่แล้ว",
											align: "center"
										},
										container3: {
											type: "group",
											schema: {
												column1: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_1: {
															type: "static",
															tag: "p",
															content: "การ์ดเครื่องจักร :"
														}
													}
												},
												column2: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_1: {
															type: "group",
															schema: {
																column1: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {}
																},
																column2: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		machine_guard_old_value: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 6
																				}
																			},
																			default: "ปกติ",
																			disabled: true
																		}
																	}
																}
															}
														}
													}
												},
												column3: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														machine_guard_status: {
															type: "radiogroup",
															view: "tabs",
															items: [
																{
																	value: 0,
																	label: "ปกติ",
																	description: "Description"
																},
																{
																	value: 1,
																	label: "ไม่ปกติ",
																	description: "Description 2"
																}
															]
														}
													}
												}
											}
										},
										container3_2: {
											type: "group",
											schema: {
												column1_1: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_2: {
															type: "static",
															tag: "p",
															content: "Limit switch :",
															label: "test",
															referenceName: "test"
														}
													}
												},
												column2_1: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_3: {
															type: "group",
															schema: {
																column1_2: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {}
																},
																column2_2: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		limit_switch_old_value: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 6
																				}
																			},
																			default: "ไม่ปกติ",
																			disabled: true
																		}
																	}
																}
															}
														}
													}
												},
												column3_1: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														limit_switch_status: {
															type: "radiogroup",
															view: "tabs",
															items: [
																{
																	value: 0,
																	label: "ปกติ",
																	description: "Description"
																},
																{
																	value: 1,
																	label: "ไม่ปกติ",
																	description: "Description 2"
																}
															]
														}
													}
												}
											}
										},
										container3_4: {
											type: "group",
											schema: {
												column1_3: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_3: {
															type: "static",
															tag: "p",
															content: "Emergency stop :"
														}
													}
												},
												column2_3: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_5: {
															type: "group",
															schema: {
																column1_4: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {}
																},
																column2_4: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		emergency_old_value: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 6
																				}
																			},
																			default: "ปกติ",
																			disabled: true
																		}
																	}
																}
															}
														}
													}
												},
												column3_2: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														emergency_status: {
															type: "radiogroup",
															view: "tabs",
															items: [
																{
																	value: 0,
																	label: "ปกติ",
																	description: "Description"
																},
																{
																	value: 1,
																	label: "ไม่ปกติ",
																	description: "Description 2"
																}
															]
														}
													}
												}
											}
										},
										container3_6: {
											type: "group",
											schema: {
												column1_5: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_4: {
															type: "static",
															tag: "p",
															content: "Trend Grahp :"
														}
													}
												},
												column2_5: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_7: {
															type: "group",
															schema: {
																column1_6: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {}
																},
																column2_6: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		trend_grahp_old_value: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 6
																				}
																			},
																			default: "ปกติ",
																			disabled: true
																		}
																	}
																}
															}
														}
													}
												},
												column3_3: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														trend_grahp_status: {
															type: "radiogroup",
															view: "tabs",
															items: [
																{
																	value: 0,
																	label: "ปกติ",
																	description: "Description"
																},
																{
																	value: 1,
																	label: "ไม่ปกติ",
																	description: "Description 2"
																}
															]
														}
													}
												}
											}
										},
										h4_1: {
											type: "static",
											tag: "h4",
											content: "ตรวจสอบอุณหภูมิ :"
										},
										container3_8: {
											type: "group",
											schema: {
												column1_7: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_5: {
															type: "static",
															tag: "p",
															content: "อุณหภูมิก่อนเข้าอุโมงค์ :"
														}
													}
												},
												column2_7: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_9: {
															type: "group",
															schema: {
																temp_old_value: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_4: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_10: {
															type: "group",
															schema: {
																column1: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										container2_1: {
											type: "group",
											schema: {
												column1: {
													type: "group",
													columns: {
														container: 6
													},
													schema: {
														h4_2: {
															type: "static",
															tag: "h4",
															content: "แท็งค์ 1"
														},
														container3_16: {
															type: "group",
															schema: {
																column1: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {}
																},
																column2: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		h4_4: {
																			type: "static",
																			tag: "p",
																			content: "สถานะชั่วโมงที่แล้ว",
																			align: "left"
																		}
																	}
																},
																column3: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {}
																}
															}
														},
														container3_12: {
															type: "group",
															schema: {
																column1: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		p_6: {
																			type: "static",
																			tag: "p",
																			content: "อุณหภูมิ CCP ≤ 0 :"
																		}
																	}
																},
																column2: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_1: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_2: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_13: {
															type: "group",
															schema: {
																column1_10: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_8: {
																			type: "static",
																			tag: "p",
																			content: "แรงดัน :"
																		}
																	}
																},
																column2_9: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_5: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_6: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_6: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_15: {
															type: "group",
															schema: {
																column1_12: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_10: {
																			type: "static",
																			tag: "p",
																			content: "สภาพหัว spray :"
																		}
																	}
																},
																column2_11: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_9: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "ปกติ"
																		}
																	}
																},
																column3_8: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		radioTabs: {
																			type: "radiogroup",
																			view: "tabs",
																			items: [
																				{
																					value: 0,
																					label: "ปกติ",
																					description: "Description"
																				},
																				{
																					value: 1,
																					label: "ไม่ปกติ",
																					description: "Description 2"
																				}
																			],
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												},
												column1_13: {
													type: "group",
													columns: {
														container: 6
													},
													schema: {
														h4_6: {
															type: "static",
															tag: "h4",
															content: "แท็งค์ 2"
														},
														container3_17: {
															type: "group",
															schema: {
																column1_14: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {}
																},
																column2_12: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		h4_7: {
																			type: "static",
																			tag: "p",
																			content: "สถานะชั่วโมงที่แล้ว",
																			align: "left"
																		}
																	}
																},
																column3_9: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {}
																}
															}
														},
														container3_18: {
															type: "group",
															schema: {
																column1_15: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		p_11: {
																			type: "static",
																			tag: "p",
																			content: "อุณหภูมิ CCP ≤ 0 :"
																		}
																	}
																},
																column2_13: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_10: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_10: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_11: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_19: {
															type: "group",
															schema: {
																column1_16: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_12: {
																			type: "static",
																			tag: "p",
																			content: "แรงดัน :"
																		}
																	}
																},
																column2_14: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_12: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_11: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_13: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_20: {
															type: "group",
															schema: {
																column1_17: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_13: {
																			type: "static",
																			tag: "p",
																			content: "สภาพหัว spray :"
																		}
																	}
																},
																column2_15: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_14: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "ปกติ"
																		}
																	}
																},
																column3_12: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		radioTabs_1: {
																			type: "radiogroup",
																			view: "tabs",
																			items: [
																				{
																					value: 0,
																					label: "ปกติ",
																					description: "Description"
																				},
																				{
																					value: 1,
																					label: "ไม่ปกติ",
																					description: "Description 2"
																				}
																			],
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												},
												column1_8: {
													type: "group",
													columns: {
														container: 6
													},
													schema: {
														h4_3: {
															type: "static",
															tag: "h4",
															content: "แท็งค์ 3"
														},
														container3_14: {
															type: "group",
															schema: {
																column1_11: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		p_7: {
																			type: "static",
																			tag: "p",
																			content: "อุณหภูมิ CCP ≤ 0 :"
																		}
																	}
																},
																column2_10: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_3: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_7: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_4: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_21: {
															type: "group",
															schema: {
																column1_18: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_9: {
																			type: "static",
																			tag: "p",
																			content: "แรงดัน :"
																		}
																	}
																},
																column2_16: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_7: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_13: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_8: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_22: {
															type: "group",
															schema: {
																column1_19: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_14: {
																			type: "static",
																			tag: "p",
																			content: "สภาพหัว spray :"
																		}
																	}
																},
																column2_17: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_15: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "ปกติ"
																		}
																	}
																},
																column3_14: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		radioTabs_2: {
																			type: "radiogroup",
																			view: "tabs",
																			items: [
																				{
																					value: 0,
																					label: "ปกติ",
																					description: "Description"
																				},
																				{
																					value: 1,
																					label: "ไม่ปกติ",
																					description: "Description 2"
																				}
																			],
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												},
												column1_20: {
													type: "group",
													columns: {
														container: 6
													},
													schema: {
														h4_8: {
															type: "static",
															tag: "h4",
															content: "แท็งค์ 4"
														},
														container3_24: {
															type: "group",
															schema: {
																column1_22: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		p_15: {
																			type: "static",
																			tag: "p",
																			content: "อุณหภูมิ CCP ≤ 0 :"
																		}
																	}
																},
																column2_19: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_16: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_16: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_17: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_25: {
															type: "group",
															schema: {
																column1_23: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_16: {
																			type: "static",
																			tag: "p",
																			content: "แรงดัน :"
																		}
																	}
																},
																column2_20: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_18: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_17: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_19: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_26: {
															type: "group",
															schema: {
																column1_24: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_17: {
																			type: "static",
																			tag: "p",
																			content: "สภาพหัว spray :"
																		}
																	}
																},
																column2_21: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_20: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "ปกติ"
																		}
																	}
																},
																column3_18: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		radioTabs_3: {
																			type: "radiogroup",
																			view: "tabs",
																			items: [
																				{
																					value: 0,
																					label: "ปกติ",
																					description: "Description"
																				},
																				{
																					value: 1,
																					label: "ไม่ปกติ",
																					description: "Description 2"
																				}
																			],
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												},
												column1_25: {
													type: "group",
													columns: {
														container: 6
													},
													schema: {
														h4_10: {
															type: "static",
															tag: "h4",
															content: "แท็งค์ 5"
														},
														container3_28: {
															type: "group",
															schema: {
																column1_27: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		p_18: {
																			type: "static",
																			tag: "p",
																			content: "อุณหภูมิ CCP ≤ 0 :"
																		}
																	}
																},
																column2_23: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_21: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_20: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_22: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_29: {
															type: "group",
															schema: {
																column1_28: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_19: {
																			type: "static",
																			tag: "p",
																			content: "แรงดัน :"
																		}
																	}
																},
																column2_24: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_23: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_21: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_24: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_30: {
															type: "group",
															schema: {
																column1_29: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_20: {
																			type: "static",
																			tag: "p",
																			content: "สภาพหัว spray :"
																		}
																	}
																},
																column2_25: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_25: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "ปกติ"
																		}
																	}
																},
																column3_22: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		radioTabs_4: {
																			type: "radiogroup",
																			view: "tabs",
																			items: [
																				{
																					value: 0,
																					label: "ปกติ",
																					description: "Description"
																				},
																				{
																					value: 1,
																					label: "ไม่ปกติ",
																					description: "Description 2"
																				}
																			],
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												},
												column1_30: {
													type: "group",
													columns: {
														container: 6
													},
													schema: {
														h4_12: {
															type: "static",
															tag: "h4",
															content: "แท็งค์ 6"
														},
														container3_32: {
															type: "group",
															schema: {
																column1_32: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		p_21: {
																			type: "static",
																			tag: "p",
																			content: "อุณหภูมิ CCP ≤ 0 :"
																		}
																	}
																},
																column2_27: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_26: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_24: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_27: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_33: {
															type: "group",
															schema: {
																column1_33: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_22: {
																			type: "static",
																			tag: "p",
																			content: "แรงดัน :"
																		}
																	}
																},
																column2_28: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_28: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "-"
																		}
																	}
																},
																column3_25: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_29: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														},
														container3_34: {
															type: "group",
															schema: {
																column1_34: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		p_23: {
																			type: "static",
																			tag: "p",
																			content: "สภาพหัว spray :"
																		}
																	}
																},
																column2_29: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		text_30: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 9
																				}
																			},
																			disabled: true,
																			default: "ปกติ"
																		}
																	}
																},
																column3_26: {
																	type: "group",
																	columns: {
																		container: 4
																	},
																	schema: {
																		radioTabs_5: {
																			type: "radiogroup",
																			view: "tabs",
																			items: [
																				{
																					value: 0,
																					label: "ปกติ",
																					description: "Description"
																				},
																				{
																					value: 1,
																					label: "ไม่ปกติ",
																					description: "Description 2"
																				}
																			],
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										},
										container3_31: {
											type: "group",
											schema: {
												column1_31: {
													type: "group",
													columns: {
														default: {
															container: 4
														},
														lg: {
															container: 4
														}
													},
													schema: {}
												},
												column2_22: {
													type: "group",
													columns: {
														default: {
															container: 4
														},
														lg: {
															container: 4
														}
													},
													schema: {
														h4_9: {
															type: "static",
															tag: "p",
															content: "สถานะชั่วโมงที่แล้ว",
															align: "center"
														}
													}
												},
												column3_19: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {}
												}
											}
										},
										container3_11: {
											type: "group",
											schema: {
												column1_9: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_24: {
															type: "static",
															tag: "p",
															content: "ความเร็วของสายพาน (0.73 m/Min) :"
														}
													}
												},
												column2_8: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_23: {
															type: "group",
															schema: {
																temp_old_value_1: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_5: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_27: {
															type: "group",
															schema: {
																column1_21: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_18: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_1: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_15: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										h4_5: {
											type: "static",
											tag: "h4",
											content: "อุณหภูมิหลังออกจากอุโมงค์ ≤ 40 ℃ :"
										},
										container3_38: {
											type: "group",
											schema: {
												column1_39: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_31: {
															type: "static",
															tag: "p",
															content: "ขวดที่ 1"
														}
													}
												},
												column2_32: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_42: {
															type: "group",
															schema: {
																temp_old_value_2: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_23: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_43: {
															type: "group",
															schema: {
																column1_43: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_36: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_2: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_29: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										container3_44: {
											type: "group",
											schema: {
												column1_44: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_32: {
															type: "static",
															tag: "p",
															content: "ขวดที่ 2"
														}
													}
												},
												column2_37: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_45: {
															type: "group",
															schema: {
																temp_old_value_3: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_33: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_46: {
															type: "group",
															schema: {
																column1_45: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_38: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_3: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_34: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										container3_47: {
											type: "group",
											schema: {
												column1_46: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_33: {
															type: "static",
															tag: "p",
															content: "ขวดที่ 3"
														}
													}
												},
												column2_39: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_48: {
															type: "group",
															schema: {
																temp_old_value_4: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_35: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_49: {
															type: "group",
															schema: {
																column1_47: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_40: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_4: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_36: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										h4_11: {
											type: "static",
											tag: "h4",
											content: "ค่าความเป็นสูญญากาศ ≤ 0.3 Bar :"
										},
										container3_35: {
											type: "group",
											schema: {
												column1_26: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_25: {
															type: "static",
															tag: "p",
															content: "ขวดที่ 1"
														}
													}
												},
												column2_26: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_36: {
															type: "group",
															schema: {
																temp_old_value_5: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_27: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_37: {
															type: "group",
															schema: {
																column1_35: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_30: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_5: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_28: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										container3_39: {
											type: "group",
											schema: {
												column1_36: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_26: {
															type: "static",
															tag: "p",
															content: "ขวดที่ 2"
														}
													}
												},
												column2_31: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_40: {
															type: "group",
															schema: {
																temp_old_value_6: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_30: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_41: {
															type: "group",
															schema: {
																column1_37: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_33: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_6: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_31: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										},
										container3_50: {
											type: "group",
											schema: {
												column1_38: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														p_27: {
															type: "static",
															tag: "p",
															content: "ขวดที่ 3"
														}
													}
												},
												column2_34: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_51: {
															type: "group",
															schema: {
																temp_old_value_7: {
																	type: "text",
																	disabled: true,
																	default: "-"
																}
															}
														}
													}
												},
												column3_32: {
													type: "group",
													columns: {
														container: 4
													},
													schema: {
														container3_52: {
															type: "group",
															schema: {
																column1_40: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 3
																		}
																	},
																	schema: {}
																},
																column2_35: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 4
																		}
																	},
																	schema: {
																		temp_7: {
																			type: "text",
																			columns: {
																				lg: {
																					container: 10
																				}
																			}
																		}
																	}
																},
																column3_37: {
																	type: "group",
																	columns: {
																		default: {
																			container: 4
																		},
																		lg: {
																			container: 5
																		}
																	},
																	schema: {}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						},
						sort: true
					},
					textarea: {
						type: "textarea",
						label: "หมายเหตุ"
					}
				}
			},
			isDownloadJson: false,
			nameFileJson: "",
			modeEditor: "tree",
			valueForm: {
				json: {},
				text: undefined
			},
			LabelForm: {
				json: {},
				text: undefined
			},
			LabelFormDelay: {
				json: {},
				text: undefined
			}
		}
	},
	mounted() {
		this.loadJson()
	},
	methods: {
		setNewValueUpdateDataEditor: function (value) {
			const cloneContent = _.cloneDeep(this.valueForm)
			const mergeContent = { ...cloneContent, json: { ...cloneContent.json, ...value } }
			const json = mergeContent.json
			//convert json to jsonString
			const text = JSON.stringify(json, null, 2)
			this.valueForm = { ...cloneContent, json, text }
		},
		updateData: function (formData) {
			this.setNewValueUpdateDataEditor(formData)
		},
		delaySave: debounce(function (content) {
			const cloneContent = _.cloneDeep(this.content)
			let json, text
			switch (this.modeEditor) {
				case "tree":
					json = content.json || undefined
					//convert json to jsonString
					text = JSON.stringify(json, null, 2)
					this.content = { ...cloneContent, json, text }
					break
				case "text":
					text = content.text || undefined
					json = JSON.parse(text)
					this.content = { ...cloneContent, json, text }
					break
			}
		}, 2000),
		delaySaveLabel: debounce(function (content) {
			const cloneContent = _.cloneDeep(this.LabelForm)
			let json, text
			switch (this.modeEditor) {
				case "tree":
					json = content.json || undefined
					//convert json to jsonString
					text = JSON.stringify(json, null, 2)
					this.LabelForm = { ...cloneContent, json, text }
					break
				case "text":
					text = content.text || undefined
					json = JSON.parse(text)
					this.LabelForm = { ...cloneContent, json, text }
					break
			}
		}, 2000),
		onChange: function (content) {
			this.contentDelay = content
			
		},
		onChangeValueForm: function (content) {
			const cloneContent = _.cloneDeep(this.valueForm)
			let json, text
			switch (this.modeEditor) {
				case "tree":
					json = content.json || undefined
					//convert json to jsonString
					text = JSON.stringify(json, null, 2)
					this.valueForm = { ...cloneContent, json, text }
					break
				case "text":
					text = content.text || undefined
					json = JSON.parse(text)
					this.valueForm = { ...cloneContent, json, text }
					break
			}
		},
		onChangeMode: function (mode) {
			this.modeEditor = mode
		},
		dotNotationToArray: function (path) {
			const strArray = path.split(".")
			const convertArrayNoNumber = reduce(
				strArray,
				(acc, value) => {
					const isNumber = !isNaN(value)
					if (!isNumber) {
						acc.push(value)
					}
					return acc
				},
				[]
			)
			return convertArrayNoNumber
		},
		update: function (targetKey, obj, path, newValue) {
			const [firstPath, ...otherPath] = path
			if (otherPath.length > 0) {
				const covertObjToArrayKey = Object.keys(obj[firstPath] || {})
				const isKeySchema = covertObjToArrayKey.includes("schema")
				const isKeyElement = covertObjToArrayKey.includes("element")
				if (isKeySchema) {
					obj[firstPath].schema = this.update(targetKey, obj[firstPath].schema, otherPath, newValue)
				} else if (isKeyElement) {
					obj[firstPath].element.schema = this.update(
						targetKey,
						obj[firstPath].element.schema,
						otherPath,
						newValue
					)
				}

				return obj
			} else {
				const addObject = targetKey ? { [targetKey]: newValue } : { ...newValue }
				obj[firstPath] = { ...obj[firstPath], ...addObject }
				return obj
			}
		},
		setNewValueContentEditor: function (value) {
			const cloneContent = _.cloneDeep(this.content)
			const mergeContent = { ...cloneContent, json: { ...cloneContent.json, ...value } }
			const json = mergeContent.json
			//convert json to jsonString
			const text = JSON.stringify(json, null, 2)
			this.content = { ...cloneContent, json, text }
		},
		updateValue: function (targetL, key, value) {
			const pathArray = this.dotNotationToArray(key)
			const cloneContent = _.cloneDeep(this.content)
			const updateDataForm = this.update(targetL, cloneContent.json.schema, pathArray, value)
			this.setNewValueContentEditor({ schema: updateDataForm })
		},
		onSave: function () {
			const cloneContent = _.cloneDeep(this.content)
			localStorage.setItem("jsonData", JSON.stringify(cloneContent.json))
		},
		downloadJson: function (data, filename) {
			let blob
			const jsonString = JSON.stringify(data, null, 2)
			blob = new Blob([jsonString], { type: "application/json" })
			//example format moment date-month-year-hour-minute-second in thai
			const dateNow = moment().format("DD-MM-YYYY-HH-mm-ss")
			// Step 1: Create the JSON string from the data object

			// Step 2: Create a Blob from the JSON string

			// Step 3: Create a URL for the Blob
			const url = URL.createObjectURL(blob)

			// Step 4: Create an anchor element
			const a = document.createElement("a")
			a.href = url
			a.download = `${filename}-${dateNow}`
			// Step 5: Append the anchor to the body (required for Firefox)
			document.body.appendChild(a)

			// Step 6: Programmatically click the anchor to trigger the download
			a.click()

			// Step 7: Remove the anchor from the document
			document.body.removeChild(a)

			// Step 8: Revoke the object URL (clean up)
			URL.revokeObjectURL(url)
			this.isDownloadJson = false
		},
		setExampleJsonData: function () {
			this.setNewValueContentEditor({ ...this.EXAMPLE_JSON_DATA })
		},
		loadJson: function () {
			const data = localStorage.getItem("jsonData")
			if (data) {
				this.setNewValueContentEditor({ ...JSON.parse(data || undefined) })
			}
		},
		setNewValueUpdateLabelEditor: function (value) {
			const cloneContent = _.cloneDeep(this.LabelForm)
			const mergeContent = { ...cloneContent, json: { ...cloneContent.json, ...value } }
			const json = mergeContent.json
			//convert json to jsonString
			const text = JSON.stringify(json, null, 2)
			this.LabelForm = { ...cloneContent, json, text }
		},
		addLabelFormElement: function (target, key, keySpecify, value) {
			if (value) {
				if (keySpecify) {
					return this.setNewValueUpdateLabelEditor({ [`${key}.${keySpecify}`]: value })
				}
				return this.setNewValueUpdateLabelEditor({ [`${key}.${target}`]: value })
			}
			//
		},
		onChangeLabelForm: function (content) {
			this.LabelFormDelay = content
		},
		submitForm: function (e) {
			e.preventDefault()
			this.$refs.vueFormRef.validate()
		},
		saveChangeToForm:function(e){
			const cloneContentDelay = _.cloneDeep(this.contentDelay)
			this.delaySave(cloneContentDelay)
		},
		saveChangeLabelForm:function(e){
			const cloneLabelFormDelay = _.cloneDeep(this.LabelFormDelay)
			this.delaySaveLabel(cloneLabelFormDelay)
		}
	},
	provide() {
		return {
			update: { updateValue: this.updateValue },
			labelForm: { updateLabelForm: this.addLabelFormElement, LabelFormValue: computed(() => this.LabelForm?.json) }
		}
	},
	watch: {
		content: {
			handler(val) {
				const cloneContent = _.cloneDeep(this.contentDelay)
				this.contentDelay = { ...cloneContent, json: val.json, text: val.text }
			},
			immediate: true,
			deep: true
		}
	}
}
</script>

<style>
.app {
	font-family: sans-serif;
}

.my-editor {
	width: 700px;
	height: 400px;
	display: flex;
}
</style>
