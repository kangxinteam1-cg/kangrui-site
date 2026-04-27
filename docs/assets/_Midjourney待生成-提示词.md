# 康瑞网站 · Midjourney 待生成图片 · 优化版提示词

> 已根据 `首页 hero / services-hero / area-01~04 / sub-04-standing` 等既有图的风格统一调校。
> 账号：`kangxingpt4@gmail.com`
> 网址：`https://www.midjourney.com/imagine`
> 输出路径：`docs/assets/images/`

---

## 风格 DNA（所有 prompt 共享的基底）

- **配色**：deep navy blue (#05152e) 主调 + warm brass / golden amber 暖光点缀，少量 teal undertones
- **时段**：dusk / twilight / late evening
- **光源**：cinematic side light、single dramatic shaft、brass desk lamp glow
- **材质**：polished navy marble、brass、aged leather、glass curtain wall、carved stone columns
- **镜头感**：cinematic editorial photography, premium magazine cover style, shallow depth of field
- **统一负面**：no people, no text, no watermark, no logos
- **共享后缀**：`--style raw --v 6.1 --quality 2`

---

## 1. `news-hero.png` · 新闻资讯页 hero（16:9）

```
wide cinematic photograph of a modern law firm press briefing room at late dusk, deep navy blue marble walls with subtle brass inlay trim, long polished dark walnut conference table reflecting warm amber light, stacked Chinese legal journals and folded newspapers on the surface, single brass banker lamp glowing on one side, faint blue twilight seeping through tall arched windows in the back, empty room, minimalist editorial mood, premium magazine cover style, cinematic side lighting, shallow depth of field, no people, no text, no logos --ar 16:9 --style raw --v 6.1 --quality 2
```

## 2. `insights-hero.png` · 康瑞洞察页 hero（16:9）

```
wide cinematic photograph of a quiet executive study at dusk, deep navy walls with bookshelves of leather-bound legal volumes, dark tufted leather high-back chair, large mahogany desk with open notebook and fountain pen, single brass desk lamp casting warm amber pool of light, faint blue light from a tall window overlooking a softly lit Beijing skyline at twilight, golden hour ambience, contemplative mood, editorial photography, cinematic shallow depth of field, no people, no text --ar 16:9 --style raw --v 6.1 --quality 2
```

## 3. `contact-hero.png` · 联系我们页 hero（16:9）

```
sweeping cinematic interior of a high-end Beijing law firm reception lobby at dusk, polished navy marble floor mirroring the scene, towering classical stone columns with brass capitals, navy walls with subtle brass inlay, large arched window in the back glowing with deep blue twilight, single warm pendant lamp illuminating the central reception desk, a faint Chinese ink painting visible on a side wall, minimalist editorial style, grand symmetric composition, cinematic side light, no people, no text, no logos --ar 16:9 --style raw --v 6.1 --quality 2
```

## 4. `news-featured.png` · 新闻头条配图（16:10）

```
abstract architectural low-angle photograph of grand classical stone columns of a Chinese Supreme Court style building, navy twilight sky with subtle warm golden glow on the column edges, dramatic golden-hour rim light, deep shadow gradient, refined editorial style, monumental and minimalist, cinematic, no people, no text --ar 16:10 --style raw --v 6.1 --quality 2
```

## 5. `insights-featured.png` · 洞察主编荐读封面（7:5）

```
macro close-up of a polished brass fountain pen nib writing on cream textured paper, glossy black ink stroke, deep navy blurred backdrop with a hint of brass desk lamp glow, side raking light, shallow depth of field, magazine editorial photography, intimate and contemplative, no text, no watermark --ar 7:5 --style raw --v 6.1 --quality 2
```

## 6. `insights-pick-2.png` · 洞察副推 cream 卡（4:3）

```
top-down editorial flat lay of an opened antique legal book with handwritten margin annotations in fountain pen ink, brass magnifying glass resting on the page, vintage brass paperweight, cream and warm beige color palette, soft natural side window light, gentle shadows, premium magazine flat lay photography, no text, no watermark --ar 4:3 --style raw --v 6.1 --quality 2
```

## 7. `insights-pick-3.png` · 洞察副推 teal 卡（4:3）

```
abstract macro photograph of intertwined copper and brass wires forming an elegant knot, set against a deep teal-to-navy gradient background, single warm rim light catching the metal edges, premium studio lighting, symbolic of intellectual property and connection, editorial product photography, shallow depth of field, no text, no watermark --ar 4:3 --style raw --v 6.1 --quality 2
```

---

## Midjourney 操作流程（每条 prompt）

1. 登录 https://www.midjourney.com/imagine（账号 `kangxingpt4@gmail.com`）
2. 把上面整段 prompt 粘到输入框 → 回车提交
3. 等约 60-90 秒生成 4 格 variation
4. 挑画面最稳的那张点击 → `Upscale (Subtle)` 放大到单张高清
5. Upscale 完成后 → 右键另存 / Download → 重命名为对应文件名
6. 保存到 `docs/assets/images/` 即可

## Claude 推荐的挑选标准（与既有图保持一致）

- 主体居中或对称构图优先（参考 area-03-hero、services-hero 的中轴线感）
- 暖光要"集中点亮"而非全屏铺暖（参考 sub-04-standing 的台灯感）
- navy 占整体画面 60% 以上，保证全站视觉统一
- 避开过度赛博朋克的霓虹风（首页 hero 已有，其他页不要重复）
- 避开任何隐约出现的文字/logo/水印
