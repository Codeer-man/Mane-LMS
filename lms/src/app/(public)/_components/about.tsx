"use client";

import React, { useState } from "react";
import styles from "./animation.module.css";
import { contentItems, data, image } from "./constants";
import Image from "next/image";

export default function About() {
  const [imagenum, setImage] = useState<number>(-1);

  const link = image[imagenum]?.link;

  return (
    <div className={styles.wrapper}>
      {/* <h1 className="text-7xl">We Offer</h1> */}
      {imagenum === -1 ? null : (
        <Image src={link} alt="image" className={styles.image} fill />
      )}

      {data.map((i, index) => (
        <div className={styles.card} key={index}>
          <h2 className={styles.title} onMouseEnter={() => setImage(index)}>
            {i.text}
          </h2>

          <div className={styles.hoverBox}>
            <div className={styles.anime}>
              {[...Array.from({ length: 10 })].map((_, i) => (
                <React.Fragment key={i}>
                  {contentItems.map((item, index) => (
                    <h4 key={index} className={styles.contentItem}>
                      {item}
                    </h4>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
