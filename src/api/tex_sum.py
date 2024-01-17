import sys
from transformers import pipeline

print("In python", str(sys.argv))

#less than 30 words wont work.
#illusion of choice for less than 30 words

# def tex_sum(text):
# 	summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
	


# sum_list = summarizer(text, max_length=150, min_length=30, do_sample=False)

# summary = sum_list[0].get("summary_text")

# print(len(summary))

# print(summary)
