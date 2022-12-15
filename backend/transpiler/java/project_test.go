package java

import (
	"bytes"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestParseProject(t *testing.T) {
	type Output struct {
		Nodes []any
		Edges []types.Relation
	}

	type ParseFilesTest struct {
		Input  []types.File
		Output Output
	}

	var tests = []ParseFilesTest{
		{
			[]types.File{
				{
					Name:      "BmiActivity",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator;
					import androidx.appcompat.app.AppCompatActivity;
					import android.content.Intent;
					import android.graphics.Color;
					import android.os.Bundle;
					import android.util.Log;
					import android.view.View;
					import android.widget.Button;
					import android.widget.TextView;
					public class BmiActivity extends AppCompatActivity {
						TextView bmiValue, bmiCategory,bmiTips;
						String category;
						String bmiValOutput;
						Button calculateAgainBtn;
						String[] bmiTipsArray;
						@Override
						protected void onCreate(Bundle savedInstanceState) {
							super.onCreate(savedInstanceState);
							setContentView(R.layout.activity_bmi);
							bmiValue = findViewById(R.id.bmi_value);
							bmiCategory = findViewById(R.id.bmi_category);
							bmiTips = findViewById(R.id.bmi_tips);
							bmiTipsArray = getResources().getStringArray(R.array.tips_array);
							calculateAgainBtn = findViewById(R.id.calculate_again_btn);
							bmiValOutput = getIntent().getStringExtra("bmiVal");
							bmiValue.setText(bmiValOutput);
							findCategory();
							categoryTips();
							calculateAgainBtn.setOnClickListener(new View.OnClickListener() {
								@Override
								public void onClick(View v) {
									onBackPressed();
								}
							});
						}
						private void categoryTips() {
							double result = Double.parseDouble(bmiValOutput);
							if(result < 15){
							   bmiTips.setText(bmiTipsArray[0]);
							}
							else if(result >= 15 && result <= 16){
								bmiTips.setText(bmiTipsArray[0]);
							}
							else if(result >= 16 && result <= 18.5){
								bmiTips.setText(bmiTipsArray[1]);
							}
							else if(result >= 18.5 && result <= 25){
								bmiTips.setText(bmiTipsArray[2]);
							}
							else if(result >= 25 && result <= 30){
								bmiTips.setText(bmiTipsArray[3]);
							}
							else if(result >=30 && result <= 35){
								bmiTips.setText(bmiTipsArray[4]);
							}
							else if(result >= 35 && result <= 50){
								bmiTips.setText(bmiTipsArray[4]);
							}
							else
								bmiTips.setText(bmiTipsArray[4]);
						}
						private void findCategory() {
							double result = Double.parseDouble(bmiValOutput);
							if(result < 15){
								category = "Very Severely Underweight";
								bmiCategory.setText(category);
							}
							else if(result >= 15 && result <= 16){
								category = "Severely Underweight";
								bmiCategory.setText(category);
							}
							else if(result >= 16 && result <= 18.5){
								category = "Underweight";
								bmiCategory.setText(category);
							}
							else if(result >= 18.5 && result <= 25){
								category = "Normal (Healthy weight)";
								bmiCategory.setText(category);
							}
							else if(result >= 25 && result <= 30){
								category = "Overweight";
								bmiCategory.setText(category);
							}
							else if(result >=30 && result <= 35){
								category = "Moderately Obese";
								bmiCategory.setText(category);
							}
							else if(result >= 35 && result <= 50){
								bmiCategory.setText(category);
								category = "Severely Obese";
							}
							else
								category = "Very Severely Obese";
							bmiCategory.setText(category);
						}
					}`),
				},
				{
					Name:      "MainActivity",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator;
					import com.tarun.bmicalculator.shouldShowUp.EnumTest4;
					import com.tarun.bmicalculator.shouldShowUp.EnumTest5;
					import com.tarun.bmicalculator.shouldShowUp222.*;
					import androidx.appcompat.app.AppCompatActivity;
					import androidx.cardview.widget.CardView;
					import android.content.Intent;
					import android.os.Bundle;
					import android.view.View;
					import android.widget.Button;
					import android.widget.NumberPicker;
					import android.widget.TextView;
					import android.widget.Toast;
					import com.google.android.material.floatingactionbutton.FloatingActionButton;
					import java.text.DecimalFormat;
					public class MainActivity extends AppCompatActivity implements View.OnClickListener {
						CardView weightCardView;
						CardView ageCardView;
						TextView weightCounterText, ageCounterText, height_title_text;
						FloatingActionButton weightBtnInc, ageBtnInc;
						FloatingActionButton weightBtnDec, ageBtnDec;
						int weightCounter = 50;
						int ageCounter = 25;
						String countWeight, countAge;
						NumberPicker feetPicker, inchPicker;
						int feetValue = 5 , inchValue = 4;
						Button calculateBtn;
						String heightValue;
						DecimalFormat decimalFormat;
						@Override
						protected void onCreate(Bundle savedInstanceState) {
							super.onCreate(savedInstanceState);
							setContentView(R.layout.activity_main);
							weightCardView = findViewById(R.id.weight_cardView);
							ageCardView = findViewById(R.id.age_cardView);
							weightCounterText = findViewById(R.id.weight_counter_text);
							ageCounterText = findViewById(R.id.age_counter_text);
							weightBtnInc = findViewById(R.id.weight_btn_inc);
							weightBtnDec = findViewById(R.id.weight_btn_dec);
							ageBtnInc = findViewById(R.id.age_btn_inc);
							ageBtnDec = findViewById(R.id.age_btn_dec);
							feetPicker = findViewById(R.id.feet_picker);
							inchPicker = findViewById(R.id.inch_picker);
							height_title_text = findViewById(R.id.height_title_text);
							calculateBtn = findViewById(R.id.calculate_btn);
							counterInit();
							decimalFormat = new DecimalFormat(".#");
							weightCardView.setOnClickListener(this);
							ageCardView.setOnClickListener(this);
							weightBtnInc.setOnClickListener(this);
							weightBtnDec.setOnClickListener(this);
							ageBtnInc.setOnClickListener(this);
							ageBtnDec.setOnClickListener(this);
							feetPicker.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
								@Override
								public void onValueChange(NumberPicker picker, int oldVal, int newVal) {
									feetValue = newVal;
									heightValueIs();
								}
							});
							inchPicker.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
								@Override
								public void onValueChange(NumberPicker picker, int oldVal, int newVal) {
									inchValue = newVal;
									heightValueIs();
								}
							});
							calculateBtn.setOnClickListener(new View.OnClickListener() {
								@Override
								public void onClick(View v) {
									calculateBmi();
								}
							});
						}
						@Override
						public void onClick(View v) {
							switch (v.getId())
							{
								case R.id.weight_cardView:
									break;
								case R.id.weight_btn_inc:
									if(weightCounter < 700)
									weightCounter++;
									countWeight = Integer.toString(weightCounter);
									weightCounterText.setText(countWeight);
									break;
								case R.id.weight_btn_dec:
									if(weightCounter > 0)
									weightCounter--;
									countWeight = Integer.toString(weightCounter);
									weightCounterText.setText(countWeight);
									break;
								case R.id.age_cardView:
								   break;
								case R.id.age_btn_inc:
									if(ageCounter < 150)
										ageCounter++;
									countAge = Integer.toString(ageCounter);
									ageCounterText.setText(countAge);
									break;
								case R.id.age_btn_dec:
									if(ageCounter > 1)
										ageCounter--;
									countAge = Integer.toString(ageCounter);
									ageCounterText.setText(countAge);
									break;
							}
						}
						private void counterInit() {
							countWeight = Integer.toString(weightCounter);
							weightCounterText.setText(countWeight);
							countAge = Integer.toString(ageCounter);
							ageCounterText.setText(countAge);
							feetPicker.setMinValue(1);
							feetPicker.setMaxValue(8);
							inchPicker.setMinValue(0);
							inchPicker.setMaxValue(11);
							feetPicker.setValue(5);
							inchPicker.setValue(4);
							heightValueIs();
						}
						public void heightValueIs()
						{
							if(inchValue == 0){
								heightValue = feetValue + " feet ";
								height_title_text.setText(heightValue);
							}
							else
							heightValue = feetValue + " feet " + inchValue +" inches";
							height_title_text.setText(heightValue);
						}
						public void calculateBmi(){
							double heightInInches = feetValue * 12 + inchValue;
							double heightInMetres = heightInInches / 39.37;
							double heightInMetreSq = heightInMetres * heightInMetres;
							double bmi = weightCounter / heightInMetreSq;
							String bmiValue = decimalFormat.format(bmi);
							Intent intent = new Intent(this,BmiActivity.class);
							intent.putExtra("bmiVal",bmiValue);
							startActivity(intent);
						}
						public EnumTest1 test1(){
							return null;
						}
						public void test2(EnumTest2 v){
							EnumTest1 t = EnumTest1.Yo;
						}
						public void test3(com.tarun.bmicalculator.shouldNotShowUp.EnumTest3 v){
						}
						public void test4(EnumTest4 v){
						}
						public void test5(com.tarun.bmicalculator.shouldShowUp.EnumTest5 v){
						}
						public void test6(EnumTest3 v){
						}
						public void test7() {
							EnumTest6 t;
						}
						public void test8() {
							int EnumTest7;
						}
					}`),
				},
				{
					Name:      "EnumTest1",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator;
					public enum EnumTest1 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest2",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator;
					public enum EnumTest2 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest3",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator.shouldNotShowUp;
					public enum EnumTest3 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest4",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator.shouldShowUp;
					public enum EnumTest4 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest5",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator.shouldShowUp;
					public enum EnumTest5 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest3",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator.shouldShowUp222;
					public enum EnumTest3 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest6",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator;
					public enum EnumTest6 {
						Hi,Yo
					}`),
				},
				{
					Name:      "EnumTest7",
					Extension: "java",
					Code: []byte(`
					package com.tarun.bmicalculator;
					public enum EnumTest7 {
						Hi,Yo
					}`),
				},
			},
			Output{
				Nodes: []any{
					types.JavaClass{
						Package: []byte("com.tarun.bmicalculator"),
						Name:    []byte("BmiActivity"),
						Extends: [][]byte{[]byte("AppCompatActivity")},
						Variables: []types.JavaVariable{
							{Type: []byte("TextView"), Name: []byte("bmiValue")},
							{Type: []byte("TextView"), Name: []byte("bmiCategory")},
							{Type: []byte("TextView"), Name: []byte("bmiTips")},
							{Type: []byte("String"), Name: []byte("category")},
							{Type: []byte("String"), Name: []byte("bmiValOutput")},
							{Type: []byte("Button"), Name: []byte("calculateAgainBtn")},
							{Type: []byte("String[]"), Name: []byte("bmiTipsArray")},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("onCreate"),
								AccessModifier: []byte("protected"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("Bundle"),
										Name: []byte("savedInstanceState"),
									},
								},
								Functionality: []byte("super.onCreate(savedInstanceState);setContentView(R.layout.activity_bmi);bmiValue=findViewById(R.id.bmi_value);bmiCategory=findViewById(R.id.bmi_category);bmiTips=findViewById(R.id.bmi_tips);bmiTipsArray=getResources().getStringArray(R.array.tips_array);calculateAgainBtn=findViewById(R.id.calculate_again_btn);bmiValOutput=getIntent().getStringExtra(\"bmiVal\");bmiValue.setText(bmiValOutput);findCategory();categoryTips();calculateAgainBtn.setOnClickListener(new View.OnClickListener(){public void onClick(View v){onBackPressed();}});"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("categoryTips"),
								AccessModifier: []byte("private"),
								Functionality:  []byte("double result=Double.parseDouble(bmiValOutput);if(result<15){bmiTips.setText(bmiTipsArray[0]);}else if(result>=15&&result<=16){bmiTips.setText(bmiTipsArray[0]);}else if(result>=16&&result<=18.5){bmiTips.setText(bmiTipsArray[1]);}else if(result>=18.5&&result<=25){bmiTips.setText(bmiTipsArray[2]);}else if(result>=25&&result<=30){bmiTips.setText(bmiTipsArray[3]);}else if(result>=30&&result<=35){bmiTips.setText(bmiTipsArray[4]);}else if(result>=35&&result<=50){bmiTips.setText(bmiTipsArray[4]);}else bmiTips.setText(bmiTipsArray[4]);"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("findCategory"),
								AccessModifier: []byte("private"),
								Functionality:  []byte("double result=Double.parseDouble(bmiValOutput);if(result<15){category=\"Very Severely Underweight\";bmiCategory.setText(category);}else if(result>=15&&result<=16){category=\"Severely Underweight\";bmiCategory.setText(category);}else if(result>=16&&result<=18.5){category=\"Underweight\";bmiCategory.setText(category);}else if(result>=18.5&&result<=25){category=\"Normal (Healthy weight)\";bmiCategory.setText(category);}else if(result>=25&&result<=30){category=\"Overweight\";bmiCategory.setText(category);}else if(result>=30&&result<=35){category=\"Moderately Obese\";bmiCategory.setText(category);}else if(result>=35&&result<=50){bmiCategory.setText(category);category=\"Severely Obese\";}else category=\"Very Severely Obese\";bmiCategory.setText(category);"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("com.tarun.bmicalculator"),
						Name:       []byte("MainActivity"),
						Extends:    [][]byte{[]byte("AppCompatActivity")},
						Implements: [][]byte{[]byte("View.OnClickListener")},
						Variables: []types.JavaVariable{
							{Type: []byte("CardView"), Name: []byte("weightCardView")},
							{Type: []byte("CardView"), Name: []byte("ageCardView")},
							{Type: []byte("TextView"), Name: []byte("weightCounterText")},
							{Type: []byte("TextView"), Name: []byte("ageCounterText")},
							{Type: []byte("TextView"), Name: []byte("height_title_text")},
							{Type: []byte("FloatingActionButton"), Name: []byte("weightBtnInc")},
							{Type: []byte("FloatingActionButton"), Name: []byte("ageBtnInc")},
							{Type: []byte("FloatingActionButton"), Name: []byte("weightBtnDec")},
							{Type: []byte("FloatingActionButton"), Name: []byte("ageBtnDec")},
							{Type: []byte("int"), Name: []byte("weightCounter"), Value: []byte("50")},
							{Type: []byte("int"), Name: []byte("ageCounter"), Value: []byte("25")},
							{Type: []byte("String"), Name: []byte("countWeight")},
							{Type: []byte("String"), Name: []byte("countAge")},
							{Type: []byte("NumberPicker"), Name: []byte("feetPicker")},
							{Type: []byte("NumberPicker"), Name: []byte("inchPicker")},
							{Type: []byte("int"), Name: []byte("feetValue"), Value: []byte("5")},
							{Type: []byte("int"), Name: []byte("inchValue"), Value: []byte("4")},
							{Type: []byte("Button"), Name: []byte("calculateBtn")},
							{Type: []byte("String"), Name: []byte("heightValue")},
							{Type: []byte("DecimalFormat"), Name: []byte("decimalFormat")},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("onCreate"),
								AccessModifier: []byte("protected"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("Bundle"),
										Name: []byte("savedInstanceState"),
									},
								},
								Functionality: []byte("super.onCreate(savedInstanceState);setContentView(R.layout.activity_main);weightCardView=findViewById(R.id.weight_cardView);ageCardView=findViewById(R.id.age_cardView);weightCounterText=findViewById(R.id.weight_counter_text);ageCounterText=findViewById(R.id.age_counter_text);weightBtnInc=findViewById(R.id.weight_btn_inc);weightBtnDec=findViewById(R.id.weight_btn_dec);ageBtnInc=findViewById(R.id.age_btn_inc);ageBtnDec=findViewById(R.id.age_btn_dec);feetPicker=findViewById(R.id.feet_picker);inchPicker=findViewById(R.id.inch_picker);height_title_text=findViewById(R.id.height_title_text);calculateBtn=findViewById(R.id.calculate_btn);counterInit();decimalFormat=new DecimalFormat(\".#\");weightCardView.setOnClickListener(this);ageCardView.setOnClickListener(this);weightBtnInc.setOnClickListener(this);weightBtnDec.setOnClickListener(this);ageBtnInc.setOnClickListener(this);ageBtnDec.setOnClickListener(this);feetPicker.setOnValueChangedListener(new NumberPicker.OnValueChangeListener(){public void onValueChange(NumberPicker picker,int oldVal,int newVal){feetValue=newVal;heightValueIs();}});inchPicker.setOnValueChangedListener(new NumberPicker.OnValueChangeListener(){public void onValueChange(NumberPicker picker,int oldVal,int newVal){inchValue=newVal;heightValueIs();}});calculateBtn.setOnClickListener(new View.OnClickListener(){public void onClick(View v){calculateBmi();}});"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("onClick"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("View"),
										Name: []byte("v"),
									},
								},
								Functionality: []byte("switch(v.getId()){case R.id.weight_cardView:break;case R.id.weight_btn_inc:if(weightCounter<700)weightCounter++;countWeight=Integer.toString(weightCounter);weightCounterText.setText(countWeight);break;case R.id.weight_btn_dec:if(weightCounter>0)weightCounter--;countWeight=Integer.toString(weightCounter);weightCounterText.setText(countWeight);break;case R.id.age_cardView:break;case R.id.age_btn_inc:if(ageCounter<150)ageCounter++;countAge=Integer.toString(ageCounter);ageCounterText.setText(countAge);break;case R.id.age_btn_dec:if(ageCounter>1)ageCounter--;countAge=Integer.toString(ageCounter);ageCounterText.setText(countAge);break;}"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("counterInit"),
								AccessModifier: []byte("private"),
								Functionality:  []byte("countWeight=Integer.toString(weightCounter);weightCounterText.setText(countWeight);countAge=Integer.toString(ageCounter);ageCounterText.setText(countAge);feetPicker.setMinValue(1);feetPicker.setMaxValue(8);inchPicker.setMinValue(0);inchPicker.setMaxValue(11);feetPicker.setValue(5);inchPicker.setValue(4);heightValueIs();"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("heightValueIs"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("if(inchValue==0){heightValue=feetValue+\" feet \";height_title_text.setText(heightValue);}else heightValue=feetValue+\" feet \"+inchValue+\" inches\";height_title_text.setText(heightValue);"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("calculateBmi"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("double heightInInches=feetValue*12+inchValue;double heightInMetres=heightInInches/39.37;double heightInMetreSq=heightInMetres*heightInMetres;double bmi=weightCounter/heightInMetreSq;String bmiValue=decimalFormat.format(bmi);Intent intent=new Intent(this,BmiActivity.class);intent.putExtra(\"bmiVal\",bmiValue);startActivity(intent);"),
							},
							{
								Type:           []byte("EnumTest1"),
								Name:           []byte("test1"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return null;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test2"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("EnumTest2"),
										Name: []byte("v"),
									},
								},
								Functionality: []byte("EnumTest1 t=EnumTest1.Yo;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test3"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("com.tarun.bmicalculator.shouldNotShowUp.EnumTest3"),
										Name: []byte("v"),
									},
								},
								Functionality: []byte(""),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test4"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("EnumTest4"),
										Name: []byte("v"),
									},
								},
								Functionality: []byte(""),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test5"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("com.tarun.bmicalculator.shouldShowUp.EnumTest5"),
										Name: []byte("v"),
									},
								},
								Functionality: []byte(""),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test6"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("EnumTest3"),
										Name: []byte("v"),
									},
								},
								Functionality: []byte(""),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test7"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("EnumTest6 t;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("test8"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("int EnumTest7;"),
							},
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator"),
						Name:    []byte("EnumTest1"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator"),
						Name:    []byte("EnumTest2"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator.shouldNotShowUp"),
						Name:    []byte("EnumTest3"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator.shouldShowUp"),
						Name:    []byte("EnumTest4"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator.shouldShowUp"),
						Name:    []byte("EnumTest5"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator.shouldShowUp222"),
						Name:    []byte("EnumTest3"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator"),
						Name:    []byte("EnumTest6"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
					types.JavaEnum{
						Package: []byte("com.tarun.bmicalculator"),
						Name:    []byte("EnumTest7"),
						Declarations: [][]byte{
							[]byte("Hi"),
							[]byte("Yo"),
						},
					},
				},
				Edges: []types.Relation{
					{
						FromClassId: []byte("com.tarun.bmicalculator.MainActivity"),
						ToClassId:   []byte("com.tarun.bmicalculator.EnumTest1"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("com.tarun.bmicalculator.MainActivity"),
						ToClassId:   []byte("com.tarun.bmicalculator.EnumTest2"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("com.tarun.bmicalculator.MainActivity"),
						ToClassId:   []byte("com.tarun.bmicalculator.shouldShowUp.EnumTest4"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("com.tarun.bmicalculator.MainActivity"),
						ToClassId:   []byte("com.tarun.bmicalculator.shouldShowUp.EnumTest5"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("com.tarun.bmicalculator.MainActivity"),
						ToClassId:   []byte("com.tarun.bmicalculator.shouldShowUp222.EnumTest3"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("com.tarun.bmicalculator.MainActivity"),
						ToClassId:   []byte("com.tarun.bmicalculator.EnumTest6"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
				},
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			response := ParseProject(tt.Input)

			if len(response.Nodes) != len(tt.Output.Nodes) {
				subtest.Errorf("testIndex: %s. incorrect number of nodes.\nExpected %s. Got %s\n", strconv.Itoa(testIndex), strconv.Itoa(len(tt.Output.Nodes)), strconv.Itoa(len(response.Nodes)))
				subtest.FailNow()
			}

			if len(response.Edges) != len(tt.Output.Edges) {
				subtest.Errorf("testIndex: %s. incorrect number of edges.\nExpected %s. Got %s\n", strconv.Itoa(testIndex), strconv.Itoa(len(tt.Output.Edges)), strconv.Itoa(len(response.Edges)))
				subtest.FailNow()
			}

			for i, node := range response.Nodes {
				switch response := node.(type) {
				case types.JavaAbstract:
					switch expected := tt.Output.Nodes[i].(type) {
					case types.JavaAbstract:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !byteSliceExists(response.Extends, word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !byteSliceExists(response.Extends, word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(response.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(response.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(response.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(response.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if response.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if response.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(response.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(response.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(response.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if response.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if response.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if response.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(response.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(response.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaClass:
					switch expected := tt.Output.Nodes[i].(type) {
					case types.JavaClass:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !bytes.Equal(response.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(response.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(response.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(response.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(response.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if response.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if response.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(response.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(response.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(response.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if response.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if response.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if response.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(response.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(response.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaInterface:
					switch expected := tt.Output.Nodes[i].(type) {
					case types.JavaInterface:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(response.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(response.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(response.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(response.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if response.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if response.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(response.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(response.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(response.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if response.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if response.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if response.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(response.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(response.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(response.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaEnum:
					switch expected := tt.Output.Nodes[i].(type) {
					case types.JavaEnum:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						} else if len(expected.Declarations) != len(response.Declarations) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Declarations)), strconv.Itoa(len(response.Declarations)))
							subtest.FailNow()
						}

						for _, declarations := range expected.Declarations {
							if !byteSliceExists(response.Declarations, declarations) {
								subtest.Errorf("bytes are not equal")
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				default:
					subtest.Errorf("cannot get language response")
					subtest.Fail()
				}
			}

			for _, actualOutput := range response.Edges {
				exists := false

				for _, expected := range tt.Output.Edges {
					if !bytes.Equal(actualOutput.FromClassId, expected.FromClassId) || !bytes.Equal(actualOutput.ToClassId, expected.ToClassId) {
						continue
					}

					innerExists := false
					switch expected.Type.(type) {
					case *types.Association:
						switch actualOutput.Type.(type) {
						case *types.Association:
							innerExists = true
						}
					case *types.Dependency:
						switch actualOutput.Type.(type) {
						case *types.Dependency:
							innerExists = true
						}
					case *types.Realization:
						switch actualOutput.Type.(type) {
						case *types.Realization:
							innerExists = true
						}
					case *types.Generalization:
						switch actualOutput.Type.(type) {
						case *types.Generalization:
							innerExists = true
						}
					case *types.NestedOwnership:
						switch actualOutput.Type.(type) {
						case *types.NestedOwnership:
							innerExists = true
						}
					}

					if !innerExists || actualOutput.Type.GetFromArrow() != expected.Type.GetFromArrow() || actualOutput.Type.GetToArrow() != expected.Type.GetToArrow() {
						continue
					}

					exists = true
				}

				if !exists {
					subtest.Errorf("incorrect arrow.\nactual from: %s\nactual to: %s\n", string(actualOutput.FromClassId), string(actualOutput.ToClassId))
					subtest.FailNow()
				}
			}
		})
	}
}
